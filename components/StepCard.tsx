export default function StepCard({
  step,
  title,
  desc
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <div className="text-xs text-neutral-500">{step}</div>
      <div className="mt-1 font-medium">{title}</div>
      <div className="mt-2 text-sm text-neutral-600 leading-relaxed">{desc}</div>
    </div>
  );
}
