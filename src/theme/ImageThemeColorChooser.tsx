import {
  hexFromArgb,
  themeFromImage,
} from "@material/material-color-utilities";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useSetThemeColor } from "./color.js";

export default function ThemeColorChooser({
  imageData,
}: {
  imageData?: string;
}) {
  return imageData ? (
    <ImageThemeColorChooser imageData={imageData} />
  ) : (
    <ThemeColorResetter />
  );
}

function ImageThemeColorChooser({ imageData }: { imageData: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const setThemeColor = useSetThemeColor();

  useLayoutEffect(() => {
    if (ref.current) {
      themeFromImage(ref.current)
        .then((theme) => setThemeColor(hexFromArgb(theme.source)))
        .catch((error) =>
          console.error("Error extracting theme color from image:", error)
        );
    }
  }, [setThemeColor]);

  return <img src={imageData} ref={ref} style={{ display: "none" }} />;
}

function ThemeColorResetter() {
  const setThemeColor = useSetThemeColor();
  useEffect(() => setThemeColor(undefined), [setThemeColor]);
  return null;
}
