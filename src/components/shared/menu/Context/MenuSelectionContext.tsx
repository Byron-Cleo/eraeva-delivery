"use client";
import { createContext, useContext, useState } from "react";

type MenuSelectionContextType = {
  currentAccompaniment: string | undefined;
  setCurrentAccompaniment: (accompaniment: string | undefined) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  selectedVegetableName: string | undefined;
  setSelectedVegetableName: (name: string | undefined) => void;
};

const MenuSelectionContext = createContext<MenuSelectionContextType | null>(
  null,
);

export const MenuSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentAccompaniment, setCurrentAccompaniment] = useState<
    string | undefined
  >(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVegetableName, setSelectedVegetableName] = useState<
    string | undefined
  >(undefined);

  return (
    <MenuSelectionContext.Provider
      value={{
        currentAccompaniment,
        setCurrentAccompaniment,
        currentIndex,
        setCurrentIndex,
        selectedVegetableName,
        setSelectedVegetableName,
      }}
    >
      {children}
    </MenuSelectionContext.Provider>
  );
};

export const useMenuSelection = () => {
  const context = useContext(MenuSelectionContext);
  if (!context) {
    throw new Error(
      "useMenuSelection must be used within a MenuSelectionProvider",
    );
  }
  return context;
};
