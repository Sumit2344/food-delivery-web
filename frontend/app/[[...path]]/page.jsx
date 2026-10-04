'use client'

import dynamic from 'next/dynamic'

const LegacyApp = dynamic(() => import('../../src/LegacyApp'), {
  ssr: false,
  loading: () => <main aria-live="polite">Loading Tomato...</main>,
})

export default function Page() {
  return <LegacyApp />
}
