// Color Blindness Simulation Matrices
export const colorBlindFilters = {
  protanopia: {
    name: "Protanopia (Red-Blind)",
    matrix: "0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0"
  },
  deuteranopia: {
    name: "Deuteranopia (Green-Blind)",
    matrix: "0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0"
  },
  tritanopia: {
    name: "Tritanopia (Blue-Blind)",
    matrix: "0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0"
  },
  achromatopsia: {
    name: "Achromatopsia (No Color)",
    matrix: "0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0"
  }
};