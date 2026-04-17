// Stitch "Amber Hearth" color system — adopted as project design tokens
export const COLORS = {
  // Core surfaces
  background:              "#fff8f1",
  surface:                 "#fff8f1",
  surfaceContainerLowest:  "#ffffff",
  surfaceContainerLow:     "#f9f3eb",
  surfaceContainer:        "#f4ede5",
  surfaceContainerHigh:    "#eee7df",
  surfaceContainerHighest: "#e8e1da",
  surfaceDim:              "#dfd9d1",
  surfaceBright:           "#fff8f1",
  surfaceVariant:          "#e8e1da",

  // Primary — burnt amber
  primary:          "#944600",
  primaryContainer: "#ba5900",
  primaryFixed:     "#ffdbc8",
  primaryFixedDim:  "#ffb68a",
  inversePrimary:   "#ffb68a",
  surfaceTint:      "#984700",

  // On-colors
  onBackground:          "#1e1b17",
  onSurface:             "#1e1b17",
  onSurfaceVariant:      "#564337",
  onPrimary:             "#ffffff",
  onPrimaryContainer:    "#fffbff",
  onPrimaryFixed:        "#321300",
  onPrimaryFixedVariant: "#743500",

  // Secondary
  secondary:              "#8c4e2d",
  secondaryContainer:     "#ffae85",
  secondaryFixed:         "#ffdbcb",
  secondaryFixedDim:      "#ffb692",
  onSecondary:            "#ffffff",
  onSecondaryContainer:   "#793f1f",
  onSecondaryFixed:       "#341100",
  onSecondaryFixedVariant:"#6f3718",

  // Tertiary — warm gold
  tertiary:              "#6a5a40",
  tertiaryContainer:     "#847256",
  tertiaryFixed:         "#f7dfbe",
  tertiaryFixedDim:      "#d9c3a3",
  onTertiary:            "#ffffff",
  onTertiaryContainer:   "#fffbff",
  onTertiaryFixed:       "#251a05",
  onTertiaryFixedVariant:"#54442c",

  // Outlines
  outline:        "#8a7265",
  outlineVariant: "#ddc1b2",

  // Error
  error:          "#ba1a1a",
  errorContainer: "#ffdad6",
  onError:        "#ffffff",
  onErrorContainer: "#93000a",

  // Inverse
  inverseSurface:   "#33302b",
  inverseOnSurface: "#f7f0e8",
} as const;

export const FONTS = {
  headline: "'Newsreader', Georgia, serif",
  body:     "'Lora', Georgia, serif",
  label:    "'Newsreader', Georgia, serif",
  size: {
    xs:      "11px",
    sm:      "13px",
    base:    "15px",
    md:      "17px",
    lg:      "22px",
    xl:      "28px",
    display: "3.5rem",
    hero:    "5rem",
  },
} as const;

export const RADIUS = {
  DEFAULT: "1rem",
  lg:      "2rem",
  xl:      "3rem",
  full:    "9999px",
} as const;

export const SHADOWS = {
  ambient: "0 8px 24px rgba(92, 46, 0, 0.06)",
  button:  "0 2px 8px rgba(196, 94, 0, 0.25)",
  modal:   "0 8px 32px rgba(92, 46, 0, 0.15)",
} as const;

export const GRADIENTS = {
  cta: "linear-gradient(135deg, #944600 0%, #ba5900 100%)",
} as const;
