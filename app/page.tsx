import { APP_CONFIG } from "@/config/app";
import SiteNav from "@/components/ui/SiteNav";

const STATS = [
  { value: "85%", label: "Revenue to you" },
  { value: "₹0", label: "To start" },
  { value: "1 link", label: "Your storefront" },
  { value: "∞", label: "Recipes you can sell" },
];

const FEATURES = [
  {
    icon: "auto_stories",
    tag: "Publish",
    title: "Recipe pages worth cooking from",
    desc: "Structured ingredients, numbered steps, built-in timers, and nutrition — all in one page your readers will actually use.",
  },
  {
    icon: "link",
    tag: "Share",
    title: "One link, your whole world",
    desc: `${APP_CONFIG.domain}/yourname — drop it in your bio, newsletter, or Reels caption.`,
  },
  {
    icon: "insights",
    tag: "Analytics",
    title: "Know what resonates",
    desc: "Which recipes earn. Which get saved. Where readers drop off. Real signal, not vanity metrics.",
  },
  {
    icon: "public",
    tag: "Built for India",
    title: "INR pricing. Local payments.",
    desc: "UPI-friendly checkout, INR-native pricing, and a payment stack your audience already trusts.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create your storefront",
    desc: "Sign up free. Set your name, cuisine, and bio. You're live in minutes — no tech required.",
  },
  {
    n: "02",
    title: "Publish your first recipe",
    desc: "Use our structured editor — ingredients, steps, timers, cover photo. Clean and fast.",
  },
  {
    n: "03",
    title: "Share and earn",
    desc: "Drop your link. Readers pay once. Money goes straight to your account. That's it.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background overflow-x-hidden">

      <SiteNav
        center={
          <>
            {["Features", "How it works", "Pricing"].map((item) => (
              <a key={item} href="#" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </>
        }
        right={
          <>
            <a href="/login" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors hidden sm:block">
              Log in
            </a>
            <a href="/signup" className="cta-gradient text-on-primary px-5 py-2 rounded-full font-body font-medium text-sm shadow-[0_2px_8px_rgba(196,94,0,0.25)] hover:opacity-90 active:scale-95 transition-all">
              Start free
            </a>
          </>
        }
      />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex flex-col lg:flex-row items-center gap-16 px-6 md:px-10 pt-20 pb-28 max-w-7xl mx-auto w-full min-h-[88vh]">

        {/* Ambient background blobs */}
        <div className="absolute top-10 right-0 w-[700px] h-[700px] rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-tertiary-fixed/50 blur-2xl pointer-events-none" />

        {/* Left — copy */}
        <div className="flex-1 relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1.5 rounded-full mb-8 animate-fade-up"
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >restaurant</span>
            <span className="font-headline text-xs font-bold uppercase tracking-widest italic">
              For food creators
            </span>
          </div>

          <h1
            className="font-headline font-bold italic text-on-background leading-[0.88] tracking-tight mb-8 animate-fade-up"
            style={{ fontSize: "clamp(3.8rem, 9vw, 7.5rem)", animationDelay: "0.08s" }}
          >
            Your recipes<br />deserve to<br />
            <span className="text-primary">earn.</span>
          </h1>

          <p
            className="font-body text-xl text-on-surface-variant leading-relaxed max-w-lg mb-10 italic animate-fade-up"
            style={{ animationDelay: "0.18s" }}
          >
            {APP_CONFIG.tagline}. Publish structured recipes, sell them directly to your fans,
            and build a business — not just a following.
          </p>

          <div
            className="flex flex-wrap gap-4 mb-10 animate-fade-up"
            style={{ animationDelay: "0.26s" }}
          >
            <a
              href="/signup"
              className="cta-gradient text-on-primary px-8 py-3.5 rounded-full font-body font-bold text-base shadow-[0_4px_16px_rgba(196,94,0,0.32)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Start publishing free
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 font-body text-base font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              See how it works
              <span className="material-symbols-outlined text-base">arrow_downward</span>
            </a>
          </div>

          <div
            className="flex flex-wrap items-center gap-6 animate-fade-up"
            style={{ animationDelay: "0.34s" }}
          >
            {[
              { icon: "verified", label: "85% revenue to you" },
              { icon: "lock_open", label: "Free to start" },
              { icon: "credit_card_off", label: "No card needed" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 font-body text-xs text-outline">
                <span
                  className="material-symbols-outlined text-sm text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — product mockup */}
        <div
          className="relative w-full max-w-xs lg:max-w-sm shrink-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Main recipe card */}
          <div className="bg-surface-container-lowest rounded-[1.5rem] shadow-[0_32px_80px_rgba(92,46,0,0.16)] overflow-hidden border border-outline-variant/20">
            {/* Cover gradient (simulates food photo) */}
            <div className="h-48 bg-gradient-to-br from-[#f5c07e] via-[#e8935a] to-[#b85500] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-headline font-bold uppercase tracking-widest italic">
                  North Indian
                </span>
              </div>
            </div>

            <div className="p-5">
              {/* Meta row */}
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 font-body text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                  45 mins
                </span>
                <span className="flex items-center gap-1 font-body text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">bar_chart</span>
                  Medium
                </span>
              </div>

              <h3 className="font-headline text-xl font-bold italic text-on-surface mb-4 leading-tight">
                Chettinad Pepper Chicken
              </h3>

              {/* Ingredient rows */}
              <ul className="space-y-2 mb-4">
                {["Curry leaves", "Black pepper", "Chettinad masala"].map((ing) => (
                  <li key={ing} className="flex justify-between items-center py-1.5 border-b border-outline-variant/20">
                    <span className="font-body text-sm text-on-surface-variant">{ing}</span>
                    <span className="font-body text-sm font-bold text-primary">2 tsp</span>
                  </li>
                ))}
              </ul>

              {/* Footer row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <span className="font-body text-xs text-on-surface-variant">Priya Kitchen</span>
                </div>
                <span className="font-body text-sm font-bold text-primary">₹149</span>
              </div>
            </div>
          </div>

          {/* Floating "New sale" badge */}
          <div className="absolute -top-5 -right-5 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] animate-pulse">
            <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-outline block">
              New sale
            </span>
            <span className="font-headline font-bold text-base italic" style={{ color: "#4ade80" }}>
              +₹126.65
            </span>
          </div>

          {/* Floating saves badge */}
          <div className="absolute -bottom-5 -left-5 bg-surface-container-lowest border border-outline-variant/20 px-4 py-3 rounded-xl shadow-[0_8px_24px_rgba(92,46,0,0.10)]">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >favorite</span>
              <span className="font-body text-xs text-on-surface-variant">247 saves</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="bg-surface-container border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/30">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center py-4 px-6">
              <span className="font-headline text-4xl md:text-5xl font-bold italic text-primary mb-1">
                {s.value}
              </span>
              <span className="font-headline text-xs font-bold uppercase tracking-widest text-outline">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-28 max-w-7xl mx-auto w-full">
        <div className="mb-16">
          <p className="font-headline text-xs font-bold uppercase tracking-widest text-primary mb-4">
            The platform
          </p>
          <h2
            className="font-headline font-bold italic text-on-background leading-[0.92]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Everything a serious<br />food creator needs.
          </h2>
        </div>

        {/* Editorial grid: big card left, 4 small right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Big monetisation card */}
          <div className="md:col-span-5 bg-inverse-surface rounded-[1.5rem] p-10 flex flex-col justify-between min-h-[400px] group hover:brightness-105 transition-all">
            <div>
              <span
                className="material-symbols-outlined text-primary text-3xl mb-6 block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >payments</span>
              <p className="font-headline text-xs font-bold uppercase tracking-widest text-outline mb-3">
                Monetise
              </p>
              <h3 className="font-headline text-3xl font-bold italic text-inverse-on-surface leading-tight mb-4">
                Sell directly.<br />Keep 85%.
              </h3>
              <p className="font-body text-inverse-on-surface/70 leading-relaxed">
                Set your price. Your reader pays once, keeps the recipe forever. No middlemen,
                no platform tax, no subscription to manage.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-8">
              <span className="font-body text-sm font-bold text-primary group-hover:underline underline-offset-4">
                Learn more
              </span>
              <span className="material-symbols-outlined text-primary text-base">arrow_right_alt</span>
            </div>
          </div>

          {/* 4 smaller feature cards */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-[1.5rem] p-7 hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(92,46,0,0.08)] transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="material-symbols-outlined text-primary text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >{f.icon}</span>
                  <span className="font-headline text-xs font-bold uppercase tracking-widest text-primary">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold italic text-on-surface mb-2 leading-tight">
                  {f.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-surface-container-low border-t border-outline-variant/20 py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-headline text-xs font-bold uppercase tracking-widest text-primary mb-4">
                The process
              </p>
              <h2
                className="font-headline font-bold italic text-on-background leading-[0.92]"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
              >
                Zero to earning<br />in three steps.
              </h2>
            </div>
            <a
              href="/signup"
              className="cta-gradient text-on-primary px-8 py-3.5 rounded-full font-body font-bold text-sm shadow-[0_4px_16px_rgba(196,94,0,0.25)] hover:brightness-110 active:scale-[0.98] transition-all w-fit"
            >
              Start free →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/20 rounded-[1.5rem] overflow-hidden">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="bg-surface-container-low p-10 hover:bg-background transition-colors"
              >
                <span className="font-headline text-7xl font-bold italic text-primary/15 block mb-6 leading-none select-none">
                  {s.n}
                </span>
                <h3 className="font-headline text-2xl font-bold italic text-on-surface mb-3">
                  {s.title}
                </h3>
                <p className="font-body text-on-surface-variant leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────────────── */}
      <section className="bg-inverse-surface py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-headline text-7xl text-primary/50 italic leading-none block mb-4 select-none">
            "
          </span>
          <blockquote
            className="font-headline font-bold italic text-inverse-on-surface leading-[0.95] mb-8"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            The only platform that treats food creators like the professionals they are.
          </blockquote>
          <p className="font-body text-outline text-sm italic">
            What we're building towards — join us.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="cta-gradient rounded-[2rem] p-12 md:p-20 text-center shadow-[0_32px_80px_rgba(196,94,0,0.22)]">
            <p className="font-headline text-xs font-bold uppercase tracking-widest text-on-primary/60 mb-5">
              Ready when you are
            </p>
            <h2
              className="font-headline font-bold italic text-on-primary leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Start earning from<br />your recipes today.
            </h2>
            <p className="font-body text-on-primary/80 text-lg mb-10 italic max-w-md mx-auto leading-relaxed">
              Free to join. No credit card. Your first recipe live in under 10 minutes.
            </p>
            <a
              href="/signup"
              className="inline-block bg-on-primary text-primary px-14 py-4 rounded-full font-body font-bold text-base hover:bg-surface-container-lowest active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              Start publishing free →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-outline-variant/20 py-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-headline text-lg font-bold italic text-primary">
            {APP_CONFIG.name}
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-body text-sm text-outline">
            {["Terms", "Privacy", "Help"].map((l) => (
              <a key={l} href="#" className="hover:text-primary transition-colors">
                {l}
              </a>
            ))}
          </div>
          <p className="font-body text-xs text-outline opacity-60">
            © {new Date().getFullYear()} {APP_CONFIG.name}. Crafted for the digital hearth.
          </p>
        </div>
      </footer>

    </main>
  );
}
