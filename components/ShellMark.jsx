export function ShellMark({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M32 8c9 8 20 13.5 20 26.5C52 47 42.5 56 32 56S12 47 12 34.5C12 21.5 23 16 32 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M32 18c5.5 5.5 12 8.5 12 16.5 0 7.5-5.4 13-12 13s-12-5.5-12-13C20 26.5 26.5 23.5 32 18Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="32" cy="37" r="2" fill="currentColor" />
    </svg>
  );
}
