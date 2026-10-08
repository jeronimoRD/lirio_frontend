import { useState } from 'react';

export function useFeedCard() {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const closeMenu = () => {
    setOpenMenu(false);
  };

  return {
    openMenu,
    toggleMenu,
    closeMenu,
  };
}