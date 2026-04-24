from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def testing_something():
    return {"message": "heloo world is this working?"}
