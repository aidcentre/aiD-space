/**
 * Timing for the grain thumbnails of /ParticleMorphingDemo2, kept apart from
 * particleMorph2.ts so the page can show it without loading three.js.
 */

/** Seconds each still holds (shimmering, never still) between dissolves. */
export const HOLD = 3.5;
/** Each particle starts dissolving a random 0-DISSOLVE_DELAY s into the transition... */
export const DISSOLVE_DELAY = 1.0;
/** ...and takes a random DISSOLVE_MIN-DISSOLVE_MAX s to break up and re-form. */
export const DISSOLVE_MIN = 3.4;
export const DISSOLVE_MAX = 4.2;
/** Seconds from the first particle breaking up to the last one settling. */
export const TRANSITION = DISSOLVE_DELAY + DISSOLVE_MAX;
