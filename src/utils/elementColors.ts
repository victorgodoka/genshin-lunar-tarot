export type ElementType = 'anemo' | 'hydro' | 'cryo' | 'geo' | 'electro' | 'pyro' | 'dendro';

export const ELEMENT_COLORS = {
  anemo: {
    primary: 'teal-500',
    light: 'teal-400',
    dark: 'teal-600',
    bg: 'teal-500/20',
    border: 'teal-500/30',
    text: 'teal-200',
    gradient: 'from-teal-500 to-teal-600'
  },
  hydro: {
    primary: 'blue-500',
    light: 'blue-400',
    dark: 'blue-600',
    bg: 'blue-500/20',
    border: 'blue-500/30',
    text: 'blue-200',
    gradient: 'from-blue-500 to-blue-600'
  },
  cryo: {
    primary: 'cyan-500',
    light: 'cyan-400',
    dark: 'cyan-600',
    bg: 'cyan-500/20',
    border: 'cyan-500/30',
    text: 'cyan-200',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  geo: {
    primary: 'yellow-500',
    light: 'yellow-400',
    dark: 'yellow-600',
    bg: 'yellow-500/20',
    border: 'yellow-500/30',
    text: 'yellow-200',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  electro: {
    primary: 'purple-500',
    light: 'purple-400',
    dark: 'purple-600',
    bg: 'purple-500/20',
    border: 'purple-500/30',
    text: 'purple-200',
    gradient: 'from-purple-500 to-purple-600'
  },
  pyro: {
    primary: 'red-500',
    light: 'red-400',
    dark: 'red-600',
    bg: 'red-500/20',
    border: 'red-500/30',
    text: 'red-200',
    gradient: 'from-red-500 to-red-600'
  },
  dendro: {
    primary: 'green-500',
    light: 'green-400',
    dark: 'green-600',
    bg: 'green-500/20',
    border: 'green-500/30',
    text: 'green-200',
    gradient: 'from-green-500 to-green-600'
  }
};

export function getElementColor(element: ElementType, variant: keyof typeof ELEMENT_COLORS.anemo = 'primary'): string {
  return ELEMENT_COLORS[element]?.[variant] || ELEMENT_COLORS.hydro[variant];
}

export function getElementClasses(element: ElementType) {
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.hydro;
  return {
    primary: `bg-${colors.primary}`,
    light: `bg-${colors.light}`,
    dark: `bg-${colors.dark}`,
    bg: `bg-${colors.bg}`,
    border: `border-${colors.border}`,
    text: `text-${colors.text}`,
    gradient: `bg-gradient-to-r ${colors.gradient}`,
    hover: `hover:bg-${colors.light}`,
    ring: `ring-${colors.primary}`,
    shadow: `shadow-${colors.primary}/30`
  };
}
