import {
  createContext,
  createElement,
  useContext,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

export type ThemeColors = {
  ink: string;
  muted: string;
  soft: string;
  canvas: string;
  paper: string;
  line: string;
  accent: string;
  accentSoft: string;
  danger: string;
};

export const lightColors: ThemeColors = {
  ink: "#17324d",
  muted: "#6d8194",
  soft: "#eaf2f8",
  canvas: "#f5f8fb",
  paper: "#ffffff",
  line: "#d8e3ec",
  accent: "#00529c",
  accentSoft: "#dcecf8",
  danger: "#b44f5b",
};

export const darkColors: ThemeColors = {
  ink: "#f4f7fa",
  muted: "#9aa8b5",
  soft: "#20262c",
  canvas: "#090b0d",
  paper: "#12161a",
  line: "#2b333b",
  accent: "#4d9bd8",
  accentSoft: "#183651",
  danger: "#e07882",
};

export const colors = lightColors;
const ThemeContext = createContext<ThemeColors>(lightColors);

export function ThemeProvider({
  mode,
  children,
}: {
  mode: "light" | "dark";
  children: ReactNode;
}) {
  return createElement(
    ThemeContext.Provider,
    { value: mode === "dark" ? darkColors : lightColors },
    children,
  );
}

export function useThemeColors() {
  return useContext(ThemeContext);
}

export const shadow = Platform.select({
  web: { boxShadow: "0 8px 24px rgba(0, 82, 156, 0.10)" },
  default: {
    elevation: 2,
    shadowColor: "#00529c",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
