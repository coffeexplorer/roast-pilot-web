export default function Alert({
  kind,
  message
}: {
  kind: "success" | "error" | "info";
  message: string;
}) {
  const cls =
    kind === "success"
      ? "border-green-200 bg-green-50 text-green-900"
      : kind === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-neutral-200 bg-neutral-50 text-neutral-800";

  return (
    <div className={"rounded-md border px-3 py-2 text-sm " + cls}>{message}</div>
  );
}
