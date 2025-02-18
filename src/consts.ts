export const SITE = {
  title: "QuartFlow - Bulk Quart Unit Calculator",
  description: "Efficiently calculate and allocate volume based units from bulk totes. A simple tool for product distribution planning.",
  url: "https://quartflow.jpshlk.com",
  author: "jpasholk",
  githubUrl: "https://github.com/jpasholk/quartflow",
  authorUrl: "https://jpshlk.com"
};

export const QUART_CONSTANTS = {
  quartsPerCubicFoot: 25.714,
  defaultTotes: 1,
  defaultCubicFeet: 62,
  sizes: {
    small: 8,
    medium: 16,
    large: 24
  },
  ui: {
    sliderDefaults: {
      min: 0,
      max: 100,
      initialValue: 0
    },
    inputValidation: {
      minTotes: 1,
      minCuft: 0,
      step: 1
    }
  }
};