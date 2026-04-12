"use client";

import { Icon } from "@/components/ui/Icon";
import { useTranslations } from "next-intl";

const STEPS = ["pending", "confirmed", "preparing", "shipping", "delivered"] as const;

type StatusEntry = { status: string; timestamp: number; note?: string };

export function TrackingTimeline({
  currentStatus,
  statusHistory,
}: {
  currentStatus: string;
  statusHistory?: StatusEntry[];
}) {
  const t = useTranslations("tracking");

  const isCancelled = currentStatus === "cancelled";
  const currentIdx = STEPS.indexOf(currentStatus as any);

  const getTimestamp = (status: string) => {
    if (!statusHistory) return null;
    const entry = [...statusHistory].reverse().find((e) => e.status === status);
    return entry ? entry.timestamp : null;
  };

  const formatTs = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isCancelled) {
    const cancelTs = getTimestamp("cancelled");
    return (
      <div className="flex items-center gap-3 p-4 bg-error/10 rounded-2xl ring-1 ring-error/20">
        <Icon name="cancel" filled className="text-error text-2xl" />
        <div>
          <div className="font-bold text-error">{t("cancelled")}</div>
          {cancelTs && (
            <div className="text-xs text-on-surface-variant">{formatTs(cancelTs)}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STEPS.map((step, idx) => {
        const isActive = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const ts = getTimestamp(step);
        const note = statusHistory
          ?.filter((e) => e.status === step && e.note)
          .map((e) => e.note)
          .pop();

        return (
          <div key={step} className="flex gap-4">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? "bg-primary text-white shadow-md"
                    : isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-container text-on-surface-variant"
                }`}
              >
                <Icon
                  name={isActive ? "check_circle" : "circle"}
                  filled={isActive}
                  className="text-lg"
                />
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-0.5 flex-1 min-h-[2rem] ${
                    isActive && idx < currentIdx
                      ? "bg-primary/40"
                      : "bg-outline-variant/40"
                  }`}
                />
              )}
            </div>
            {/* Label */}
            <div className="pb-6 pt-1">
              <div
                className={`font-bold text-sm ${
                  isActive ? "text-on-surface" : "text-on-surface-variant"
                }`}
              >
                {t(step)}
              </div>
              {ts && (
                <div className="text-xs text-on-surface-variant mt-0.5">
                  {formatTs(ts)}
                </div>
              )}
              {note && (
                <div className="text-xs text-on-surface-variant mt-1 italic">
                  {note}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
