"use client";

import type { JSX, ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

export interface Hover {
  value: number | null;
  origin: string | null;
}

interface HoverContextType {
  hovered: Hover | null;
  updateHover: (ids: Hover | null) => void;
}

interface HoverProviderProps {
  children: ReactNode;
}

export const HoverContext = createContext<HoverContextType | null>(null);

export function HoverProvider(props: HoverProviderProps): JSX.Element {
  const { children } = props;
  const [hovered, setHovered] = useState<Hover | null>(null);

  const value = useMemo(() => {
    const updateHover = (hover: Hover | null) => {
      setHovered(hover);
    };
    return { hovered, updateHover };
  }, [hovered]);

  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

export function useHoverState() {
  const value = useContext(HoverContext);
  if (value == null) {
    console.log("Missing hover context!");
  }
  return value;
}
