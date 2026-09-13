import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, useThemeColors } from "../theme";
import { Ionicons } from "@expo/vector-icons";

export type Tab = "home" | "groups" | "search" | "profile";

type Props = { active: Tab; onChange: (tab: Tab) => void };
const items: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "home", label: "Home", icon: "home-outline" },
  { id: "groups", label: "Groups", icon: "people-outline" },
  { id: "search", label: "Search", icon: "search-outline" },
  { id: "profile", label: "Profile", icon: "person-outline" },
];

export function BottomNav({ active, onChange }: Props) {
  const theme = useThemeColors();
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.paper, borderTopColor: theme.line },
      ]}
    >
      {items.map((item) => (
        <Pressable
          key={item.id}
          style={styles.item}
          onPress={() => onChange(item.id)}
        >
          <Text
            style={[
              styles.icon,
              { color: theme.muted },
              active === item.id && { color: theme.accent },
            ]}
          >
            <Ionicons name={item.icon} size={25} />
          </Text>
          <Text
            style={[
              styles.label,
              { color: theme.muted },
              active === item.id && { color: theme.accent },
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 13,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.paper,
  },
  item: { alignItems: "center", minWidth: 72, gap: 4 },
  icon: { color: colors.muted, fontSize: 25, height: 28 },
  label: { color: colors.muted, fontSize: 12 },
  active: { color: colors.accent, fontWeight: "800" },
});
