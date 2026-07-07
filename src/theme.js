// =====================================================
// OSONTOP THEME SYSTEM  (yashil — #16A34A)
// =====================================================

export const COLORS = {
  primary:      "#16A34A",
  primaryDark:  "#15803D",
  primaryLight: "#22C55E",
  primaryBg:    "#F0FDF4",
  accent:       "#FF6B35",
  success:      "#16A34A",
  warning:      "#F59E0B",
  error:        "#EF4444",
  info:         "#3B82F6",
  verified:     "#1DA1F2",
};

export const theme = (dark) => ({
  bg:          dark ? "#0D0D0D" : "#F5F5F5",
  bg2:         dark ? "#141414" : "#EBEBEB",
  card:        dark ? "#1C1C1C" : "#FFFFFF",
  card2:       dark ? "#252525" : "#F8F8F8",
  card3:       dark ? "#2E2E2E" : "#F0F0F0",
  text:        dark ? "#F2F2F2" : "#1A1A1A",
  text2:       dark ? "#AAAAAA" : "#555555",
  sub:         dark ? "#777777" : "#999999",
  border:      dark ? "#2A2A2A" : "#E8E8E8",
  border2:     dark ? "#333333" : "#DDDDDD",
  primary:     COLORS.primary,
  primaryDark: COLORS.primaryDark,
  primaryLight:COLORS.primaryLight,
  primaryBg:   dark ? "#052E16" : COLORS.primaryBg,
  accent:      COLORS.accent,
  success:     COLORS.success,
  warning:     COLORS.warning,
  error:       COLORS.error,
  shadow:      dark ? "0 2px 12px rgba(0,0,0,0.6)" : "0 2px 12px rgba(0,0,0,0.08)",
  shadow2:     dark ? "0 4px 24px rgba(0,0,0,0.7)" : "0 4px 24px rgba(0,0,0,0.12)",
});
