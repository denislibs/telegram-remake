interface Props {
  size?: number
  color?: string
}

// Telegram-style verified badge (six-point burst with a check).
export default function VerifiedBadge({ size = 16, color = '#3aa0e3' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0, display: 'block' }}
      aria-label="verified"
    >
      <path
        fill={color}
        d="M12 1.5l2.3 2.1 3.1-.5.9 3 2.8 1.4-1.3 2.9 1.3 2.9-2.8 1.4-.9 3-3.1-.5L12 22.5l-2.3-2.1-3.1.5-.9-3L2.9 16.5l1.3-2.9-1.3-2.9 2.8-1.4.9-3 3.1.5L12 1.5z"
      />
      <path
        d="M8 12.2l2.6 2.6L16 9.4"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
