"use client";

function ComingSoonBanner() {
  return (
    <div className="flex items-center gap-3 bg-surface-container rounded-[10px] px-4 py-3 mb-6">
      <span className="material-symbols-outlined text-outline text-base leading-none">schedule</span>
      <p className="font-body text-sm text-on-surface-variant">
        Appearance settings are coming soon. The options below are a preview.
      </p>
    </div>
  );
}

export default function AppearanceTab() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline text-2xl font-bold italic text-on-surface">Appearance</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Customise how you experience the platform.
        </p>
      </div>

      <div className="space-y-5">
        <ComingSoonBanner />

        {/* Recipe View */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)] opacity-60 pointer-events-none">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-4">Default Recipe View</h3>
          <div className="flex gap-3">
            {["Grid", "List"].map((view) => (
              <button
                key={view}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-medium border transition-all ${
                  view === "Grid"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-base leading-none">
                  {view === "Grid" ? "grid_view" : "view_list"}
                </span>
                {view}
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)] opacity-60 pointer-events-none">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-4">Language & Region</h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">Language</label>
              <select className="bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface outline-none border-none">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-xs font-bold uppercase tracking-widest text-outline">Region</label>
              <select className="bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface outline-none border-none">
                <option>India</option>
                <option>Global</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
