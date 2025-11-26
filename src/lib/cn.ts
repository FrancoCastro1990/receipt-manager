/**
 * Utility for conditionally joining classNames together
 */
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
