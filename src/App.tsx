import {
  hexFromArgb,
  themeFromImage,
} from "@material/material-color-utilities";
import { Shuffle, Upload } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useEffect, useState } from "react";
import ThemeColorProvider from "./theme/ThemeColorProvider";
import ThemeProvider from "./theme/ThemeProvider";
import { randomColor, useSetThemeColor, useThemeColor } from "./theme/color";

export default function App() {
  return (
    <ThemeColorProvider>
      <ThemeProvider>
        <AppBar color="default" position="static">
          <Toolbar>
            <Typography variant="h6" component="h1">
              Material Dynamic Theme
            </Typography>
          </Toolbar>
        </AppBar>
        <Container
          sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <ColorChooser />
            <ThemeCard />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            <ExampleCard color="primary" />
            <ExampleCard color="secondary" />
            <ExampleCard color="tertiary" />
          </Box>
        </Container>
      </ThemeProvider>
    </ThemeColorProvider>
  );
}

function ColorChooser() {
  const themeColor = useThemeColor();
  const setThemeColor = useSetThemeColor();

  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);

      return () => {
        console.log("Revoking image URL: %s", url);
        URL.revokeObjectURL(url);
      };
    }

    setImageUrl(undefined);
  }, [imageFile]);

  useEffect(() => {
    if (!imageUrl) return;

    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.display = "none";
    img.onload = () => {
      console.log("Extracting theme color from image: %s", img.src);
      themeFromImage(img)
        .then((theme) => setThemeColor(hexFromArgb(theme.source)))
        .catch((error) =>
          console.error("Error extracting theme color from image:", error)
        );
    };

    document.body.appendChild(img);

    return () => {
      document.body.removeChild(img);
    };
  }, [imageUrl, setThemeColor]);

  return (
    <Card sx={{ display: "flex", flexDirection: "column" }}>
      {imageUrl && <CardMedia image={imageUrl} sx={{ height: 240 }} />}
      <CardHeader title="Color Chooser" />
      <CardContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <MuiColorInput
          label="Select theme color"
          value={themeColor}
          onChange={(_, { hex }) => setThemeColor(hex)}
        />
      </CardContent>
      <CardActions>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<Upload />}
        >
          Upload image
          <Box
            component="input"
            type="file"
            accept="image/*"
            value=""
            onChange={(e) => setImageFile(e.target.files?.[0])}
            sx={{
              clip: "rect(0 0 0 0)",
              clipPath: "inset(50%)",
              height: 1,
              overflow: "hidden",
              position: "absolute",
              bottom: 0,
              left: 0,
              whiteSpace: "nowrap",
              width: 1,
            }}
          />
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Shuffle />}
          onClick={() => setThemeColor(randomColor())}
        >
          Random Color
        </Button>
      </CardActions>
    </Card>
  );
}

function ThemeCard() {
  return (
    <Card>
      <CardHeader title="Theme" />
      <CardContent
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}
      >
        <ColorBlock color="surface" />
        <ColorBlock color="surface-variant" />
        <ColorBlock color="primary" />
        <ColorBlock color="primary-container" />
        <ColorBlock color="secondary" />
        <ColorBlock color="secondary-container" />
        <ColorBlock color="tertiary" />
        <ColorBlock color="tertiary-container" />
        <ColorBlock color="error" />
        <ColorBlock color="error-container" />
      </CardContent>
    </Card>
  );
}

function ColorBlock({ color, on }: { color: string; on?: boolean }) {
  return (
    <Box
      sx={{
        bgcolor: `var(--mui-palette-md-${on ? "on-" : ""}${color})`,
        color: `var(--mui-palette-md-${on ? "" : "on-"}${color})`,
        py: 1,
        px: 2,
      }}
    >
      <Typography>
        {on ? "on " : ""}
        {color}
      </Typography>
    </Box>
  );
}

function ExampleCard({
  color,
}: {
  color: "primary" | "secondary" | "tertiary";
}) {
  return (
    <Card
      sx={{
        bgcolor: `var(--mui-palette-md-${color}-container)`,
        color: `var(--mui-palette-md-on-${color}-container)`,
      }}
    >
      <CardHeader title={`Example Card (${color})`} />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Typography>Here's some example text.</Typography>
          <TextField label="Input something" fullWidth color={color} />
          <FormControlLabel
            control={<Checkbox defaultChecked color={color} />}
            label="Check this"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="outlined" color={color}>
          Secondary
        </Button>
        <Button variant="contained" color={color}>
          Primary
        </Button>
      </CardActions>
    </Card>
  );
}
