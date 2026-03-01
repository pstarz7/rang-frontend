/**
 * 1. BASIC UTILITIES
 */
export const getRandomHex = () => {
  const chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += chars[Math.floor(Math.random() * 16)];
  return color;
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export const hexToHsl = (hex) => {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
  let h = 0, s = 0, l = (cmax + cmin) / 2;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return { h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
};

export const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

/**
 * 2. HARMONY ENGINE
 */
// Add these to src/utils/colorEngine.js

/**
 * 100% STABLE HARMONY ENGINE
 */
/**
 * 100% STABLE & DYNAMIC HARMONY ENGINE
 */
export const generateHarmonyPalette = (rule = 'random', currentColors = []) => {
  // 1. Handle Random (Working perfectly as you said)
  if (rule === 'random') {
    return currentColors.map(c => c.locked ? c : { hex: getRandomHex(), locked: false });
  }

  // 2. Identify the SEED color
  const seedObj = currentColors.find(c => c.locked) || currentColors[2];
  const { h, s, l } = hexToHsl(seedObj.hex);
  
  // 3. ADD DYNAMIC NOISE (This prevents repeating the same 3 colors)
  // We add a random offset so every click is unique
  const noise = Math.floor(Math.random() * 20) - 10; // Random number between -10 and 10
  const sNoise = Math.floor(Math.random() * 10) - 5; 
  
  let resultHexes = [];

  switch (rule) {
    case 'analogous':
      // We vary the "gap" between colors so it's not always 20 degrees
      const gap = 15 + Math.floor(Math.random() * 15); 
      resultHexes = [
        hslToHex((h - (gap * 2) + 360) % 360, s + sNoise, l),
        hslToHex((h - gap + 360) % 360, s, l),
        seedObj.hex,
        hslToHex((h + gap) % 360, s, l),
        hslToHex((h + (gap * 2)) % 360, s + sNoise, l)
      ];
      break;

    case 'complementary':
      const compH = (h + 180 + noise) % 360; // Add noise to the opposite hue
      resultHexes = [
        seedObj.hex,
        hslToHex(h, s, Math.max(l - 30, 10)), 
        hslToHex(compH, s, l),
        hslToHex(compH, s, Math.min(l + 30, 90)),
        hslToHex((compH + 20) % 360, s - 20, l) // Slight hue shift for the 5th color
      ];
      break;

    case 'monochromatic':
      // We randomize the lightness steps so shades aren't always the same
      const step = 10 + Math.floor(Math.random() * 10);
      resultHexes = [
        hslToHex(h, s, Math.max(l - (step * 2), 5)),
        hslToHex(h, s, Math.max(l - step, 10)),
        seedObj.hex,
        hslToHex(h, s, Math.min(l + step, 90)),
        hslToHex(h, s, Math.min(l + (step * 2), 95))
      ];
      break;

    default:
      resultHexes = currentColors.map(() => getRandomHex());
  }

  // 4. Final Merge
  return currentColors.map((col, i) => {
    if (col.locked) return col;
    return { hex: resultHexes[i], locked: false };
  });
};
/**
 * 3. ADVANCED TOOLS
 */
export const adjustColor = (hex, amount, type) => {
  let { h, s, l } = hexToHsl(hex);
  if (type === 'h') h = (h + amount + 360) % 360;
  if (type === 's') s = Math.min(100, Math.max(0, s + amount));
  if (type === 'l') l = Math.min(100, Math.max(0, l + amount));
  return hslToHex(h, s, l);
};

export const generateShades = (hex) => {
  const { h, s } = hexToHsl(hex);
  return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(weight => ({
    weight, hex: hslToHex(h, s, 100 - weight / 10)
  }));
};

export const checkAccessibility = (foreground, background) => {
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  
  if (ratio >= 7) return { status: 'AAA', ratio: ratio.toFixed(2) };
  if (ratio >= 4.5) return { status: 'AA', ratio: ratio.toFixed(2) };
  return { status: 'Fail', ratio: ratio.toFixed(2) };
};

export const extractColorsFromImage = (imgElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Resize for performance
  canvas.width = 100;
  canvas.height = 100;
  ctx.drawImage(imgElement, 0, 0, 100, 100);
  
  const data = ctx.getImageData(0, 0, 100, 100).data;
  const colorMap = {};

  // Sample every 5th pixel for better accuracy
  for (let i = 0; i < data.length; i += 20) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    
    // Skip colors that are too dark or too white (Keep it vibrant)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 30 || brightness > 245) continue;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    colorMap[hex] = (colorMap[hex] || 0) + 1;
  }

  // Sort by frequency and take the top 5
  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(c => c[0]);
};