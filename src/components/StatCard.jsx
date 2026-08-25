import {
  ArrowUpRight,
} from "lucide-react";

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-900">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#0B6B36]">
          <Icon size={23} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs">
        <ArrowUpRight
          size={15}
          className="text-emerald-600"
        />

        <span className="font-semibold text-emerald-600">
          {description}
        </span>
      </div>
    </div>
  );
}