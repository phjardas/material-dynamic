import { createContext, useCallback, useContext } from "react";

export const defaultColor = randomColor();

export const ThemeColorContext = createContext<{
  color: string;
  setColor: (color: string) => void;
}>({
  color: defaultColor,
  setColor: () => {
    throw new Error("Missing theme color context");
  },
});

export function useThemeColor(): string {
  return useContext(ThemeColorContext).color;
}

export function useSetThemeColor(): (color: string | undefined) => void {
  const { setColor } = useContext(ThemeColorContext);
  return useCallback((color) => setColor(color ?? defaultColor), [setColor]);
}

export function randomColor() {
  const r = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const g = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const b = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${b}`;
}
