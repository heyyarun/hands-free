import { useState } from 'react'
import { REPO_URL } from '../config'

const SITE_URL = 'https://www.handfree.live/'

/**
 * What a phone or small tablet sees instead of the demo.
 *
 * The demo needs a desktop webcam, but most people arrive from a link tapped on their
 * phone. This used to be a single sentence telling them to leave; now it shows what the
 * page does, lets them send the link to a laptop, and points at the repo, so the visit
 * is not wasted. main.tsx mounts it instead of the demo below 1024px, so a phone never
 * downloads three.js or MediaPipe.
 */
export function MobileLanding() {
  const [copied, setCopied] = useState(false)
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const sendLink = async () => {
    try {
      if (canShare) {
        await navigator.share({ title: 'Hands Free', text: 'Open this on a laptop with a webcam', url: SITE_URL })
        return
      }
      await navigator.clipboard.writeText(SITE_URL)
      setCopied(true)
    } catch {
      // Dismissing the share sheet rejects; there is nothing to recover.
    }
  }

  return (
    <section className="mobile-landing" aria-label="Hands Free on a small screen">
      <img className="mobile-logo" src="/favicon.svg" alt="" width="48" height="48" />
      <p className="mobile-title">Hands Free</p>
      <p className="mobile-lede">
        Scroll, zoom and play T-Rex with your bare hands, through your webcam. Open source, runs
        entirely in your browser.
      </p>
      <img
        className="mobile-shot"
        src="/landing-shot.webp"
        alt="The Hands Free demo page on a desktop display"
        width="800"
        height="420"
        fetchPriority="high"
      />
      <p className="mobile-note">It needs a laptop or desktop webcam, so open it there.</p>
      <button className="start-button" onClick={sendLink}>
        {copied ? 'Link copied' : canShare ? 'Send the link to your laptop' : 'Copy the link for your laptop'}
      </button>
      <a className="mobile-repo" href={REPO_URL} target="_blank" rel="noreferrer">
        Star it on GitHub ↗
      </a>
    </section>
  )
}
