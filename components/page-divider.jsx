export default function PageDivider({ className = "" }) {
  return (
    <img
      src="/pagedivider.png"
      alt=""
      aria-hidden
      className={`page-divider ${className}`}
    />
  );
}
