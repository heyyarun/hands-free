/**
 * Build-time switches, read from Vite env vars (see .env.example).
 *
 * Keyboard controls are off by default: the point of the demo is that the page and the
 * game are driven by hands. Turn them on to work on either one without a camera.
 */
export const KEYBOARD_CONTROLS = import.meta.env.VITE_KEYBOARD_CONTROLS === 'true'

/** The public repo, linked from both control panels and the small-screen landing. */
export const REPO_URL = 'https://github.com/heyyarun/hands-free'
