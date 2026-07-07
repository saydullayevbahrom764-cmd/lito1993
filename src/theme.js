// =====================================================
// BIRBIR THEME SYSTEM
// =====================================================

export const COLORS = {
  primary: "#5B2D8E",
  primaryDark: "#4A2070",
  primaryLight: "#7B4DB5",
  primaryBg: "#F3EDFB",
  accent: "#FF6B35",
  accentLight: "#FF8C5A",
  success: "#27AE60",
  successLight: "#2ECC71",
  warning: "#F39C12",
  error: "#E74C3C",
  info: "#2980B9",
  verified: "#1DA1F2",
};

export const theme = (dark) => ({
  bg:       dark ? "#0D0D0D" : "#F5F5F5",
  bg2:      dark ? "#141414" : "#EBEBEB",
  card:     dark ? "#1C1C1C" : "#FFFFFF",
  card2:    dark ? "#252525" : "#F8F8F8",
  card3:    dark ? "#2E2E2E" : "#F0F0F0",
  text:     dark ? "#F2F2F2" : "#1A1A1A",
  text2:    dark ? "#AAAAAA" : "#555555",
  sub:      dark ? "#777777" : "#999999",
  border:   dark ? "#2A2A2A" : "#E8E8E8",
  border2:  dark ? "#333333" : "#DDDDDD",
  primary:  COLORS.primary,
  primaryDark: COLORS.primaryDark,
  primaryLight: COLORS.primaryLight,
  primaryBg: dark ? "#2A1A3E" : COLORS.primaryBg,
  accent:   COLORS.accent,
  success:  COLORS.success,
  warning:  COLORS.warning,
  error:    COLORS.error,
  shadow:   dark ? "0 2px 12px rgba(0,0,0,0.6)" : "0 2px 12px rgba(0,0,0,0.08)",
  shadow2:  dark ? "0 4px 24px rgba(0,0,0,0.7)" : "0 4px 24px rgba(0,0,0,0.12)",
});
