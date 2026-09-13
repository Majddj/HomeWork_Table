import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, useThemeColors } from "../theme";

import MSLULOGO from "../../public/imge/mslu_Logo.svg";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onAction?: () => void;
};

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  actionIcon,
  onAction,
}: Props) {
  const theme = useThemeColors();
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.paper, borderBottomColor: theme.line },
      ]}
    >
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={theme.ink} />
        </Pressable>
      ) : (
        <View style={[styles.logo]}>
          <MSLULOGO width={38} height={44} />
        </View>
      )}
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.accent }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {actionIcon && onAction && (
        <Pressable onPress={onAction} hitSlop={10}>
          <Ionicons name={actionIcon} size={25} color={theme.accent} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logo: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  copy: { flex: 1 },
  title: { color: colors.accent, fontSize: 12, lineHeight: 19, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 3 },
});
