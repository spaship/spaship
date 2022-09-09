import { useCallback, useState } from 'react';

export const useTabs = (tabs: number, initialOpenTab = 0) => {
  const [isOpen, setIsOpen] = useState(initialOpenTab);

  const handleTabChange = useCallback(
    (tabNum: number) => {
      setIsOpen(tabNum % tabs);
    },
    [tabs]
  );

  return {
    openTab: isOpen,
    handleTabChange
  };
};
