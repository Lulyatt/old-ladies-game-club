export default function PageDivider({ className = "" }) {
  return (
    <img
      src="/backgrounds/pageDivider.png"
      alt=""
      aria-hidden
      className={`block h-auto w-full shrink-0 ${className}`}
    />
  );
}
