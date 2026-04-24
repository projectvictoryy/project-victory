"use client";

export type StepItem = {
  id: string;
  instruction: string;
  timer_seconds: number | null;
};

interface Props {
  steps: StepItem[];
  onChange: (steps: StepItem[]) => void;
}

function uid() { return Math.random().toString(36).slice(2); }
function emptyStep(): StepItem { return { id: uid(), instruction: "", timer_seconds: null }; }

function minsToSecs(mins: string): number | null {
  const n = parseFloat(mins);
  return isNaN(n) || n <= 0 ? null : Math.round(n * 60);
}
function secsToMins(secs: number | null): string {
  if (!secs) return "";
  const m = secs / 60;
  return Number.isInteger(m) ? m.toString() : m.toFixed(1);
}

export default function MethodStep({ steps, onChange }: Props) {
  const update = (id: string, patch: Partial<StepItem>) =>
    onChange(steps.map(s => s.id === id ? { ...s, ...patch } : s));

  const remove = (id: string) => onChange(steps.filter(s => s.id !== id));
  const add = () => onChange([...steps, emptyStep()]);

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-on-surface-variant">
        Write each step clearly. Add a timer to steps that need one — readers can start it with one tap.
      </p>

      {steps.map((step, i) => (
        <div key={step.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
          {/* Step header */}
          <div className="flex items-center justify-between px-5 py-3 bg-surface-container-low border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-headline font-bold text-sm text-primary">
                {i + 1}
              </div>
              <span className="font-headline text-sm font-bold text-on-surface">Step {i + 1}</span>
            </div>
            <button
              type="button"
              onClick={() => remove(step.id)}
              disabled={steps.length === 1}
              className="text-outline hover:text-error disabled:opacity-20 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>

          {/* Instruction */}
          <div className="px-5 pt-4 pb-3">
            <textarea
              value={step.instruction}
              onChange={e => update(step.id, { instruction: e.target.value })}
              placeholder="Describe this step clearly. What should the cook do, see, hear, or smell?"
              rows={3}
              className="w-full bg-transparent font-body text-base text-on-surface placeholder:text-outline focus:outline-none resize-none"
            />
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 px-5 py-3 border-t border-outline-variant bg-surface-container-low/50">
            <span className="material-symbols-outlined text-base text-outline">timer</span>
            <label className="font-body text-sm text-outline">Timer (minutes)</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={secsToMins(step.timer_seconds)}
              onChange={e => update(step.id, { timer_seconds: minsToSecs(e.target.value) })}
              placeholder="optional"
              className="w-24 bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
            {step.timer_seconds && (
              <button
                type="button"
                onClick={() => update(step.id, { timer_seconds: null })}
                className="text-outline hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-outline-variant rounded-2xl font-body text-sm text-outline hover:border-primary hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-base">add</span>
        Add step
      </button>
    </div>
  );
}
