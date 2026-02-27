"use client";

import { useState } from "react";

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-700">{label}</div>
        <button
          type="button"
          className="text-xs text-neutral-600 hover:text-neutral-900"
          onClick={() => setShow((s) => !s)}
        >
          {show ? "숨기기" : "표시"}
        </button>
      </div>
      <input
        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}
