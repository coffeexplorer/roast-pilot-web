export default function FeatureCard({
  title,
  desc
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5 hover:bg-neutral-50">
      <div className="font-medium">{title}</div>
      <div className="mt-2 text-sm text-neutral-600 leading-relaxed">{desc}</div>
    </div>
  );
}
