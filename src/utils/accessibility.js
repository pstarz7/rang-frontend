/**
 * Calculates relative luminance of a color
 * Formula: 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
const getLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculates contrast ratio between two colors
 */
export const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Returns 'Pass' or 'Fail' based on WCAG AA (4.5:1)
 */
export const checkAccessibility = (foreground, background) => {
  const ratio = getContrastRatio(foreground, background);
  if (ratio >= 7) return { status: 'AAA', ratio: ratio.toFixed(2) };
  if (ratio >= 4.5) return { status: 'AA', ratio: ratio.toFixed(2) };
  return { status: 'Fail', ratio: ratio.toFixed(2) };
};