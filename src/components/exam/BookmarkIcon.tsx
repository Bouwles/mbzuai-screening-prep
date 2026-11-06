/** Mark-for-review bookmark: outline when unmarked, filled when marked. Colour comes from CSS. */
export function BookmarkIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 20" width="16" height="20" aria-hidden="true" focusable="false">
      <path
        d="M1.75 1.75h12.5v16.5L8 13.9l-6.25 4.35z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
