import { APP_CONFIG } from "@/config/app";

const features = [
  {
    icon: "menu_book",
    label: "Structured",
    title: "Recipes worth reading",
    desc: "Ingredients, steps, timers, and nutrition — all in one beautiful place.",
  },
  {
    icon: "payments",
    label: "Monetise",
    title: "Earn from every recipe",
    desc: "Sell individual recipes or monthly subscriptions. You keep 85% of every sale.",
  },
  {
    icon: "link",
    label: "Share",
    title: "One link, your world",
    desc: "Your storefront at one clean URL. Share it anywhere, grow everywhere.",
  },
  {
    icon: "bar_chart",
    label: "Analytics",
    title: "Know what resonates",
    desc: "See which recipes earn, which get saved, and where readers drop off.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your storefront",
    desc: "Sign up free. Set your profile, cuisine tags, and you're live in minutes.",
  },
  {
    step: "02",
    title: "Publish your first recipe",
    desc: "Use our structured editor — ingredients, steps, timers, cover photo. Done.",
  },
  {
    step: "03",
    title: "Share and earn",
    desc: "Share your link. Readers pay. You get paid directly into your account.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex justify-between items-center w-full px-8 py-4 bg-background/85 backdrop-blur-md">
        <div className="text-2xl font-bold italic font-headline text-primary">
          {APP_CONFIG.name}
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["For Creators", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="font-body text-sm font-medium text-on-surface-variant">
            Log in
          </a>
          <a
            href="/signup"
            className="cta-gradient text-on-primary px-6 py-2.5 rounded-full font-body font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-[0_2px_8px_rgba(196,94,0,0.25)]"
          >
            Start free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-32 max-w-4xl mx-auto w-full">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 italic font-headline bg-tertiary-fixed text-on-tertiary-fixed-variant">
          For food creators
        </span>
        <h1
          className="font-headline font-bold italic leading-[0.95] tracking-tight mb-8 text-on-background"
          style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
        >
          Your recipes deserve<br />to earn you money
        </h1>
        <p className="font-body text-xl leading-relaxed mb-12 max-w-2xl italic text-on-surface-variant">
          {APP_CONFIG.tagline}. Publish structured recipes, sell them directly to your fans,
          and build a business — not just a following.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="/signup"
            className="cta-gradient text-on-primary px-10 py-4 rounded-full font-body font-bold text-base w-full sm:w-auto text-center hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(196,94,0,0.25)]"
          >
            Start publishing free
          </a>
          <a
            href="#how-it-works"
            className="bg-surface-container-highest text-on-surface px-10 py-4 rounded-full font-body font-bold text-base w-full sm:w-auto text-center hover:bg-surface-variant transition-all"
          >
            See how it works
          </a>
        </div>
        <p className="font-body text-xs mt-5 italic text-outline">
          No credit card required. Free to start.
        </p>
      </section>

      {/* Features */}
      <section className="px-6 pb-28 max-w-6xl mx-auto w-full">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-10 font-headline text-outline">
          Everything a recipe creator needs
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-surface-container-lowest rounded-[1rem] p-7 flex flex-col gap-4 hover:shadow-md transition-shadow shadow-[0_8px_24px_rgba(92,46,0,0.06)]"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">{f.icon}</span>
                <span className="text-xs font-bold uppercase tracking-widest font-headline text-primary">
                  {f.label}
                </span>
              </div>
              <h3 className="font-headline text-lg font-bold italic text-on-surface">
                {f.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24 bg-surface-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold italic text-center mb-16 text-on-background">
            From zero to earning,<br />in three steps
          </h2>
          <div className="flex flex-col gap-14">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-8">
                <span className="font-headline text-5xl font-bold italic shrink-0 leading-none text-outline-variant">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-headline text-xl font-bold italic mb-2 text-on-surface">
                    {s.title}
                  </h3>
                  <p className="font-body text-base leading-relaxed text-on-surface-variant">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-surface-container-low">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold italic mb-5 text-on-background">
            Ready to earn from your recipes?
          </h2>
          <p className="font-body text-lg italic mb-10 text-on-surface-variant">
            Join food creators already building a business on {APP_CONFIG.name}.
          </p>
          <a
            href="/signup"
            className="cta-gradient inline-block text-on-primary px-12 py-4 rounded-full font-body font-bold text-base hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(196,94,0,0.25)]"
          >
            Start publishing free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 mt-auto flex flex-col items-center gap-6 text-center border-t border-surface-container-highest">
        <div className="font-headline text-lg font-bold italic text-primary">
          {APP_CONFIG.name}
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {["Terms", "Privacy", "Help"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-headline text-sm italic underline underline-offset-4 text-outline hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="font-body text-xs italic opacity-60 text-outline">
          © {new Date().getFullYear()} {APP_CONFIG.name}. Crafted with love for the digital hearth.
        </p>
      </footer>

    </main>
  );
}
