"use client";

type UsageResponse = any;

export default function UsageCards({ usage }: { usage: UsageResponse }) {
  if (!usage) return null;

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-neutral-200 p-5">
        <div className="text-sm text-neutral-700">Usage</div>
        <pre className="mt-3 text-xs overflow-auto whitespace-pre-wrap">
          {JSON.stringify(usage, null, 2)}
        </pre>
      </div>
    </div>
  );
}
