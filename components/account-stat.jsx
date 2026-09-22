export default function AccountStat({ label, value }) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-bold md:text-lg">{value}</p>
    </div>
  );
}
