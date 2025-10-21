import { Card } from '@/components/ui/card';

interface Metric {
  label: string;
  value: string;
  caption: string;
}

interface PerformanceCardProps {
  metrics: Metric[];
  message?: string;
}

export function PerformanceCard({ metrics, message }: PerformanceCardProps) {
  return (
    <Card className="space-y-6 border-neutral-200">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Performance</h2>
        {message ? <p className="mt-1 text-sm text-neutral-500">{message}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="text-sm text-neutral-500">{metric.label}</div>
            <div className="mt-2 text-2xl font-semibold text-neutral-900">{metric.value}</div>
            <div className="mt-1 text-xs text-neutral-400">{metric.caption}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
