import { Formula } from './types';

export const CATEGORIES = [
  'Algebra',
  'Calculus',
  'Geometry',
  'Probability',
  'Statistics',
  'Trigonometry',
  'Physics',
  'Chemistry'
];

export const INITIAL_FORMULAS: Partial<Formula>[] = [
  {
    name: "Quadratic Formula",
    category: "Algebra",
    description: "Used to find the roots of a quadratic equation.",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    example: "For x^2 + 5x + 6 = 0, a=1, b=5, c=6."
  }
];
