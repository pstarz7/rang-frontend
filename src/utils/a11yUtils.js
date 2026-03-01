/**
 * Calculates the relative luminance of a color
 * Formula: 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
const getLuminance = (hex) => {
  const rgb = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(rgb.substring(0, 2), 16) / 255;
  const g = parseInt(rgb.substring(2, 4), 16) / 255;
  const b = parseInt(rgb.substring(4, 6), 16) / 255;

  const res = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return res[0] * 0.2126 + res[1] * 0.7152 + res[2] * 0.0722;
};

/**
 * Calculates the contrast ratio between two hex colors
 * Formula: (L1 + 0.05) / (L2 + 0.05)
 */
export const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const getWCAGStatus = (ratio) => {
  if (ratio >= 7) return { label: 'AAA', color: 'bg-green-500', desc: 'Enhanced' };
  if (ratio >= 4.5) return { label: 'AA', color: 'bg-blue-500', desc: 'Standard' };
  if (ratio >= 3) return { label: 'Large', color: 'bg-yellow-500', desc: 'Large Text Only' };
  return { label: 'Fail', color: 'bg-red-500', desc: 'Poor Contrast' };
};