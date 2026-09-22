export function CarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.4h7.4a2 2 0 0 1 1.9 1.4L19 11m-14 0h14m-14 0a2 2 0 0 0-2 2v3.5a1 1 0 0 0 1 1h1m14-6.5a2 2 0 0 1 2 2v3.5a1 1 0 0 1-1 1h-1m-14 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1m10 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1m-14 0h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TyreIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <line x1="12" y1="3.5" x2="12" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12" y2="20.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3.5" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16" y1="12" x2="20.5" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
