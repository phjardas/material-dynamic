import "@fontsource/merriweather";
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  type Theme as MaterialTheme,
} from "@material/material-color-utilities";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  extendTheme,
} from "@mui/material/styles";
import { useMemo, type ReactNode } from "react";
import { useThemeColor } from "./color.js";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

declare module "@mui/material" {
  interface CheckboxPropsColorOverrides {
    tertiary: true;
  }

  interface ButtonPropsColorOverrides {
    tertiary: true;
  }

  interface TextFieldPropsColorOverrides {
    tertiary: true;
  }
}

function useMuiTheme() {
  const color = useThemeColor();

  return useMemo(() => {
    const theme = themeFromSourceColor(
      typeof color === "string" ? argbFromHex(color) : color
    );

    return extendTheme({
      colorSchemes: {
        light: createColorScheme(theme, "light"),
        dark: createColorScheme(theme, "dark"),
      },
      typography: {
        fontFamily: "Merriweather, sans-serif",
      },
      shape: {
        borderRadius: 20,
      },
      components: {
        MuiAppBar: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            colorDefault: {
              "--AppBar-background": "var(--mui-palette-md-surface-variant)",
              "--AppBar-color": "var(--mui-palette-md-on-surface-variant)",
              "--mui-palette-AppBar-darkBg": "var(--mui-palette-md-surface)",
              "--mui-palette-AppBar-darkColor":
                "var(--mui-palette-md-on-surface)",
            },
          },
        },
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              textTransform: "none",
              padding: "0 24px",
              minHeight: 40,
            },
          },
        },
        MuiCard: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              backgroundColor: "var(--mui-palette-md-surface)",
              color: "var(--mui-palette-md-on-surface)",
              display: "flex",
              flexDirection: "column",
            },
          },
        },
        MuiCardContent: {
          styleOverrides: {
            root: {
              flex: 1,
            },
          },
        },
        MuiCardActions: {
          styleOverrides: {
            root: {},
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              "--mui-shape-borderRadius": "4px",
            },
          },
        },
      },
    });
  }, [color]);
}

function createColorScheme(theme: MaterialTheme, mode: "light" | "dark") {
  const scheme = theme.schemes[mode];

  return {
    palette: {
      md: Object.fromEntries(
        Object.entries(scheme.toJSON()).map(([key, value]) => {
          const token = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
          const color = hexFromArgb(value);
          return [token, color];
        })
      ),
      primary: {
        main: hexFromArgb(scheme.primary),
        contrastText: hexFromArgb(scheme.onPrimary),
      },
      secondary: {
        main: hexFromArgb(scheme.secondary),
        contrastText: hexFromArgb(scheme.onSecondary),
      },
      tertiary: {
        main: hexFromArgb(scheme.tertiary),
        contrastText: hexFromArgb(scheme.onTertiary),
      },
      error: {
        main: hexFromArgb(scheme.error),
        contrastText: hexFromArgb(scheme.onError),
      },
      background: {
        default: hexFromArgb(
          theme.palettes.neutral.tone(mode === "light" ? 95 : 0)
        ),
        paper: hexFromArgb(
          theme.palettes.neutral.tone(mode === "light" ? 98 : 5)
        ),
      },
      text: {
        primary: hexFromArgb(scheme.onSurface),
        secondary: hexFromArgb(scheme.onSurfaceVariant),
      },
    },
  };
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMuiTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
