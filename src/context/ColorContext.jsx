import React, { createContext, useContext, useState, useCallback } from 'react';

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState([
    { hex: '#6366F1', locked: false },
    { hex: '#EC4899', locked: false },
    { hex: '#F59E0B', locked: false },
    { hex: '#10B981', locked: false },
    { hex: '#06B6D4', locked: false },
  ]);


  // Helper: Convert HEX to HSL for architectural math
  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  // Helper: Convert HSL back to HEX
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const generateAdvancedPalette = useCallback(() => {
    // 1. Find a reference color (either the first locked color or a new random one)
    const lockedBase = colors.find(c => c.locked);
    let [baseH, baseS, baseL] = lockedBase 
      ? hexToHsl(lockedBase.hex) 
      : [Math.random() * 360, 40 + Math.random() * 40, 50 + Math.random() * 20];

    // 2. Select a Random Architectural Rule
    const rules = ['analogous', 'monochromatic', 'complementary', 'vibrant'];
    const selectedRule = rules[Math.floor(Math.random() * rules.length)];

    const newColors = colors.map((col, index) => {
      if (col.locked) return col;

      let h = baseH, s = baseS, l = baseL;

      switch (selectedRule) {
        case 'analogous':
          h = (baseH + (index * 20) - 40 + 360) % 360;
          l = Math.max(20, Math.min(90, baseL + (index * 5) - 10));
          break;
        case 'monochromatic':
          s = Math.max(10, baseS - (index * 10));
          l = Math.max(10, Math.min(95, baseL + (index * 15) - 30));
          break;
        case 'complementary':
          if (index > 2) h = (baseH + 180) % 360;
          l = 40 + (Math.random() * 40);
          break;
        case 'vibrant':
          h = Math.random() * 360;
          s = 70 + (Math.random() * 30);
          l = 40 + (Math.random() * 30);
          break;
        default:
          h = Math.random() * 360;
      }

      return { hex: hslToHex(h, s, l), locked: false };
    });

    setColors(newColors);
  }, [colors]);

  return (
    <ColorContext.Provider value={{ 
      colors, 
      setColors, 
      generateAdvancedPalette
    }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) return { 
    colors: [], 
    setColors: () => {}, 
    generateAdvancedPalette: () => {} 
  }; 
  return context;
};