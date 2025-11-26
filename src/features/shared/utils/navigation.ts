/**
 * Navigation utility functions
 */

export const getNavLinkClassName = (isActive: boolean, isMobile: boolean = false): string => {
  const base = `flex items-center gap-2 px-4 ${isMobile ? 'py-3 w-full' : 'py-2'} rounded-lg font-medium transition-all duration-200`;
  const state = isActive
    ? 'bg-white text-primary-900'
    : 'text-white hover:bg-white/20 hover:backdrop-blur-sm';
  return `${base} ${state}`;
};

export const isActiveLink = (currentPath: string, linkPath: string): boolean => {
  if (linkPath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(linkPath);
};
