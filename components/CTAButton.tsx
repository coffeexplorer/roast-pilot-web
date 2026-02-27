import Link from "next/link";

export default function CTAButton({
  href,
  label,
  variant = "primary"
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
      : "inline-flex items-center justify-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50";
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
