import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

type AnimationType = keyof typeof gsap;

interface AnimationOptions extends GSAPTweenVars {
	type: AnimationType;
	scrollTrigger?: ScrollTrigger.Vars;
	scrambleText?: ScrambleTextPlugin.Vars;
}

export function animate(
	node: HTMLElement,
	{ type, scrollTrigger, scrambleText, ...args }: AnimationOptions
): { destroy?: () => void } {
	const method = gsap[type] as
		| ((target: gsap.TweenTarget, vars: GSAPTweenVars) => GSAPTween)
		| undefined;

	if (!method) {
		console.warn(`GSAP method "${type}" does not exist.`);
		return {};
	}

	// Create the animation with ScrambleText or ScrollTrigger if provided
	const tween = method(node, {
		...args,
		scrambleText: scrambleText
			? {
					...scrambleText
				}
			: undefined,
		scrollTrigger: scrollTrigger
			? {
					...scrollTrigger,
					trigger: scrollTrigger.trigger || node
				}
			: undefined
	});

	return {
		destroy() {
			// kill the animation when the element is removed
			tween.kill();

			// if using ScrollTrigger, make sure to kill that instance too
			if (scrollTrigger && tween.scrollTrigger) {
				tween.scrollTrigger.kill();
			}
		}
	};
}
