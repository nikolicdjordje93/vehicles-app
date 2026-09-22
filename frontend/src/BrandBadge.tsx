const PALETTE = ['#1c6dd0', '#2f9e6e', '#e08a2c', '#9855c9', '#d64545', '#0e9aa7']

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % PALETTE.length
  return PALETTE[index]
}

function initialsForName(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function BrandBadge({ name }: { name: string }) {
  return (
    <span className="brand-badge" style={{ background: colorForName(name) }}>
      {initialsForName(name)}
    </span>
  )
}
