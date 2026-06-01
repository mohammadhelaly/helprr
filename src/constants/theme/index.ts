import themeValues from "./theme-values.json";

const sizes = themeValues.sizes;

const colors = themeValues.colors;

const colorSchemes = {
  light: {
    background: colors.white,
    neutral: colors.mist,
    foreground: colors.black,
    muted: colors.stone,
    accent: colors.white,
    error: colors.red,
    highlight: colors["hot-pink"],
  },
  dark: {
    background: colors.charcoal,
    neutral: colors.graphite,
    foreground: colors.snow,
    muted: colors.steel,
    accent: colors.white,
    error: colors.red,
    highlight: colors.bubblegum,
  },
};

const tailwindColors = {
  ...colors,
  ...colorSchemes.light,
  ...(Object.fromEntries(
    Object.entries(colorSchemes.dark).map(([key, value]) => [
      `${key}-dark`,
      value,
    ]),
  ) as Record<string, string>),
};

const theme = {
  colors,
  colorSchemes,
  tailwindColors,
  sizes,
};

export { colors, colorSchemes, sizes, tailwindColors, theme };
