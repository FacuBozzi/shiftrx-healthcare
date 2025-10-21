import Link from "next/link";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PromoCardProps {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon?: ReactNode;
  gradient?: string;
}

export function PromoCard({
  eyebrow,
  title,
  description,
  ctaLabel,
  href,
  icon,
  gradient,
}: PromoCardProps) {
  return (
    <Card
      className={`relative overflow-hidden border-0 text-white shadow-none ${gradient ?? "bg-gradient-to-r from-blue-500 to-blue-400"}`}
    >
      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-white/80">
            {eyebrow}
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-white/80">{description}</p>
        </div>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="self-start bg-white text-blue-600"
        >
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
      {icon ? (
        <div className="absolute right-4 top-4 text-white/70">{icon}</div>
      ) : null}
    </Card>
  );
}
