import React, { createContext, useContext, useState } from 'react';
import { generateWCAGPalette } from '../utils/ColorEngine';

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  /**
   * INITIAL STATE: 
   * Instead of hardcoding colors, we call the engine immediately.
   * This gives a unique, artist-grade palette on every page refresh.
   */
  const [colors, setColors] = useState(() => generateWCAGPalette());

  /**
   * NEURAL GENERATION:
   * This function respects "Locked" colors. 
   * If a color is locked, it stays. If not, it gets a new neural value.
   */
  const generateNewPalette = () => {
    const freshSet = generateWCAGPalette();
    
    setColors(prevColors => 
      prevColors.map((col, index) => {
        if (col.locked) return col;
        // Map the new neural color to the unlocked slot
        return { 
          ...col, 
          hex: freshSet[index].hex 
        };
      })
    );
  };

  return (
    <ColorContext.Provider value={{ 
      colors, 
      setColors, 
      generateAdvancedPalette: generateNewPalette // Keep name consistent for your GeneratorPage
    }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};
