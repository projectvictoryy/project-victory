"use client";

const NOTIFICATION_GROUPS = [
  {
    label: "Activity",
    items: [
      { id: "new_follower",    label: "New follower",          description: "Someone follows your profile" },
      { id: "recipe_saved",    label: "Recipe saved",          description: "Someone saves one of your recipes" },
    ],
  },
  {
    label: "Creator",
    items: [
      { id: "new_subscriber",  label: "New subscriber",        description: "Someone subscribes to your content" },
      { id: "recipe_purchase", label: "Recipe purchase",       description: "Someone buys one of your recipes" },
    ],
  },
  {
    label: "Platform",
    items: [
      { id: "product_updates", label: "Product updates",       description: "New features and improvements" },
      { id: "tips",            label: "Creator tips",          description: "Advice to grow your storefront" },
    ],
  },
];

export default function NotificationsTab() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline text-2xl font-bold italic text-on-surface">Notifications</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Control which emails you receive from us.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3 bg-surface-container rounded-[10px] px-4 py-3">
          <span className="material-symbols-outlined text-outline text-base leading-none">schedule</span>
          <p className="font-body text-sm text-on-surface-variant">
            Notification settings are coming soon. Below is a preview.
          </p>
        </div>

        {NOTIFICATION_GROUPS.map((group) => (
          <section
            key={group.label}
            className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)] opacity-60 pointer-events-none"
          >
            <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-4">{group.label}</h3>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-sm font-medium text-on-surface">{item.label}</p>
                    <p className="font-body text-xs text-on-surface-variant">{item.description}</p>
                  </div>
                  <div className="relative w-11 h-6 rounded-full bg-surface-container-high shrink-0">
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
