"""
End-to-end check against a running backend.

    python scripts/smoke_test.py
    python scripts/smoke_test.py --url https://<fqdn> "who works on hydrogen safety"

Reads BACKEND_API_KEY from .env so there is no shell quoting to get wrong.
Stdlib only, so it runs anywhere the project does.
"""

import argparse
import json
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, "src")
from aid_expertise_search.config import settings  # noqa: E402

DEFAULT_QUERY = "who works on battery degradation modelling"


def post(url: str, payload: dict, api_key: str | None, timeout: int) -> dict:
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    if api_key:
        request.add_header("X-API-Key", api_key)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query", nargs="?", default=DEFAULT_QUERY)
    parser.add_argument("--url", default="http://127.0.0.1:8000")
    parser.add_argument("--timeout", type=int, default=180)
    args = parser.parse_args()

    base = args.url.rstrip("/")

    try:
        with urllib.request.urlopen(f"{base}/health", timeout=10) as response:
            print(f"health            {response.read().decode('utf-8')}")
    except urllib.error.URLError as exc:
        sys.exit(f"health check failed: {exc}\nIs the server running at {base}?")

    print(f"query             {args.query!r}")
    started = time.monotonic()
    try:
        result = post(
            f"{base}/",
            {"messages": [{"role": "user", "content": args.query}]},
            settings.backend_api_key,
            args.timeout,
        )
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        if exc.code == 401:
            sys.exit(
                f"401 {body}\n"
                "BACKEND_API_KEY in .env does not match the server's. If the server was\n"
                "started before you set it, restart uvicorn so it picks up the new value."
            )
        sys.exit(f"HTTP {exc.code}: {body}")
    elapsed = time.monotonic() - started

    print(f"elapsed           {elapsed:.1f}s\n")

    researchers = result.get("most_relevant_researchers") or []
    if researchers:
        print("most relevant researchers")
        for name, score in researchers:
            print(f"  {score:8.1f}  {name.replace('_', ' ')}")
    else:
        print("most relevant researchers: none "
              "(below MIN_SIMILARITY — expected only for off-topic queries)")

    print(f"\nanswer\n{result.get('text_answer', '')}\n")

    for name, text in result.get("general_researcher_information") or []:
        print(f"--- {name.replace('_', ' ')} ---\n{text}\n")


if __name__ == "__main__":
    main()
