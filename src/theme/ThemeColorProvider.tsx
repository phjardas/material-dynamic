import { useMemo, useState, type ReactNode } from "react";
import { ThemeColorContext, defaultColor } from "./color.js";

export default function ThemeColorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [themeColor, setThemeColor] = useState<string>(defaultColor);
  const context = useMemo(
    () => ({ color: themeColor, setColor: setThemeColor }),
    [themeColor]
  );

  return (
    <ThemeColorContext.Provider value={context}>
      {children}
    </ThemeColorContext.Provider>
  );
}
