"use client";
import { useState, useRef } from "react";

type Step = {
  id: string;
  step_number: number;
  instruction: string;
  timer_seconds: number | null;
};

interface Props {
  steps: Step[];
  freeCount?: number; // steps beyond this index are blurred (paywall)
}

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function StepTimers({ steps, freeCount }: Props) {
  const [timers, setTimers] = useState<Record<string, { remaining: number; running: boolean; done: boolean }>>({});
  const intervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const toggle = (step: Step) => {
    const id = step.id;
    const secs = step.timer_seconds!;
    const cur = timers[id];

    if (cur?.done) return;

    if (cur?.running) {
      clearInterval(intervals.current[id]);
      setTimers(t => ({ ...t, [id]: { ...t[id]!, running: false } }));
      return;
    }

    const start = cur?.remaining ?? secs;
    setTimers(t => ({ ...t, [id]: { remaining: start, running: true, done: false } }));

    intervals.current[id] = setInterval(() => {
      setTimers(t => {
        const remaining = (t[id]?.remaining ?? 1) - 1;
        if (remaining <= 0) {
          clearInterval(intervals.current[id]);
          return { ...t, [id]: { remaining: 0, running: false, done: true } };
        }
        return { ...t, [id]: { ...t[id]!, remaining, running: true } };
      });
    }, 1000);
  };

  const reset = (step: Step) => {
    clearInterval(intervals.current[step.id]);
    setTimers(t => {
      const next = { ...t };
      delete next[step.id];
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const locked = freeCount !== undefined && i >= freeCount;
        const timer = timers[step.id];

        return (
          <div
            key={step.id}
            className={`relative bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden transition-all ${
              locked ? "select-none" : ""
            }`}
          >
            <div className={locked ? "filter blur-sm pointer-events-none" : ""}>
              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-headline font-bold text-sm text-primary shrink-0">
                  {step.step_number}
                </div>
                <p className="font-body text-base text-on-surface leading-relaxed">{step.instruction}</p>
              </div>

              {step.timer_seconds && (
                <div className="flex items-center gap-3 px-5 pb-5">
                  <button
                    onClick={() => toggle(step)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-medium border transition-all ${
                      timer?.done
                        ? "bg-surface-container text-on-surface border-outline-variant cursor-default"
                        : timer?.running
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-surface-container border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {timer?.done ? "check_circle" : timer?.running ? "pause" : "timer"}
                    </span>
                    {timer?.done
                      ? "Done!"
                      : timer?.running
                      ? fmt(timer.remaining)
                      : timer?.remaining != null
                      ? fmt(timer.remaining)
                      : fmt(step.timer_seconds)}
                  </button>
                  {(timer?.running || (timer?.remaining != null && !timer?.done)) && (
                    <button onClick={() => reset(step)} className="text-outline hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-base">refresh</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {locked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-outline" style={{ fontSize: "28px" }}>lock</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
