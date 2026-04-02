import chroma from 'chroma-js';

/**
 * RANG.LAB NEURAL ENGINE v3.0 (Multi-Style Edition)
 * Styles: Minimal, Bold, Luxury, Vintage, Retro, Nature, Pastel
 */

const STYLES = {
  MINIMAL: {
    l: [98, 92, 60, 40, 15],
    c: [2, 5, 4, 3, 5],
    hRange: 10
  },
  BOLD: {
    l: [95, 80, 55, 45, 10],
    c: [10, 30, 85, 70, 20],
    hRange: 45
  },
  LUXURY: {
    l: [10, 15, 65, 85, 95], // Dark mode foundation
    c: [5, 10, 30, 25, 5],
    hRange: 20
  },
  VINTAGE: {
    l: [92, 85, 60, 50, 25],
    c: [10, 15, 35, 30, 20],
    hRange: 30
  },
  RETRO: {
    l: [90, 75, 65, 55, 15],
    c: [15, 40, 70, 80, 30],
    hRange: 160 // High color variance
  },
  NATURE: {
    l: [96, 88, 65, 45, 20],
    c: [8, 12, 40, 35, 15],
    hRange: 40
  },
  PASTEL: {
    l: [98, 94, 88, 85, 40],
    c: [5, 10, 25, 20, 15],
    hRange: 30
  }
};

export const generateWCAGPalette = () => {
  const styleKeys = Object.keys(STYLES);
  const selectedStyle = STYLES[styleKeys[Math.floor(Math.random() * styleKeys.length)]];
  
  const baseHue = Math.random() * 360;

  return [
    { 
      id: `col-1`, 
      hex: chroma.lch(selectedStyle.l[0], selectedStyle.c[0], baseHue).hex().toUpperCase(), 
      locked: false 
    },
    { 
      id: `col-2`, 
      hex: chroma.lch(selectedStyle.l[1], selectedStyle.c[1], (baseHue + 5) % 360).hex().toUpperCase(), 
      locked: false 
    },
    { 
      id: `col-3`, 
      hex: chroma.lch(selectedStyle.l[2], selectedStyle.c[2], (baseHue + selectedStyle.hRange) % 360).hex().toUpperCase(), 
      locked: false 
    },
    { 
      id: `col-4`, 
      hex: chroma.lch(selectedStyle.l[3], selectedStyle.c[3], (baseHue + (selectedStyle.hRange * 1.5)) % 360).hex().toUpperCase(), 
      locked: false 
    },
    { 
      id: `col-5`, 
      hex: chroma.lch(selectedStyle.l[4], selectedStyle.c[4], baseHue).hex().toUpperCase(), 
      locked: false 
    }
  ];
};

/**
 * Enhanced Contrast Logic
 * Uses Perceptual Luminance for better accessibility
 */
export const getContrastColor = (hex) => {
  const color = chroma(hex);
  // If color is very light, return black. If dark, return white.
  return color.luminance() > 0.45 ? '#000000' : '#FFFFFF';
};

/**
 * Intelligent Tonal Scales
 * Creates a more artistic spread than a basic white-to-black scale
 */
export const getShades = (hex) => {
  const base = chroma(hex);
  // Create an artistic scale by slightly shifting saturation while darkening
  return chroma.scale([
    base.brighten(2).desaturate(1),
    base,
    base.darken(2.5).saturate(1)
  ]).mode('lch').colors(12);

};
