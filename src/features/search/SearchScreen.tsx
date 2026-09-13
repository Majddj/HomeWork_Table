import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Group, Note } from "../../domain/types";
import { colors, useThemeColors } from "../../theme";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useSearch } from "../../hooks/useSearch";

type Props = {
  groups: Group[];
  notes: Note[];
  onSelect: (note: Note) => void;
  onSelectGroup: (id: string) => void;
};
export function SearchScreen({
  groups,
  notes,
  onSelect,
  onSelectGroup,
}: Props) {
  const [query, setQuery] = useState("");
  const theme = useThemeColors();
  const results = useSearch(query, groups, notes);
  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <ScreenHeader title="Поиск" subtitle="Найди группу или заметку" />
      <View
        style={[
          styles.search,
          { backgroundColor: theme.paper, borderColor: theme.line },
        ]}
      >
        <Text style={{ color: theme.muted }}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Поиск по заметкам и группам"
          placeholderTextColor={theme.muted}
          style={[styles.input, { color: theme.ink }]}
        />
      </View>
      <ScrollView contentContainerStyle={styles.results}>
        {!query.trim() && (
          <Text style={[styles.empty, { color: theme.muted }]}>
            Найдите нужную заметку или группу
          </Text>
        )}
        {results.map((result) => (
          <Pressable
            key={`${result.type}-${result.id}`}
            style={[styles.result, { backgroundColor: theme.paper }]}
            onPress={() => {
              const note = notes.find((item) => item.id === result.id);
              if (note) onSelect(note);
              else onSelectGroup(result.id);
            }}
          >
            <Text style={[styles.resultType, { color: theme.muted }]}>
              {result.type === "group" ? "ГРУППА" : "ЗАМЕТКА"}
            </Text>
            <Text style={[styles.title, { color: theme.ink }]}>
              {result.title}
            </Text>
            {result.groupId && (
              <Text style={[styles.group, { color: theme.accent }]}>
                {groups.find((item) => item.id === result.groupId)?.name}
              </Text>
            )}
          </Pressable>
        ))}
        {query.trim() && !results.length && (
          <Text style={[styles.empty, { color: theme.muted }]}>
            Ничего не найдено.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 22,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    backgroundColor: colors.paper,
  },
  input: { flex: 1, color: colors.ink, paddingVertical: 14, fontSize: 15 },
  results: { paddingHorizontal: 22, gap: 11 },
  result: { backgroundColor: colors.paper, padding: 18, borderRadius: 10 },
  resultType: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 5,
  },
  title: { color: colors.ink, fontWeight: "700", fontSize: 16 },
  group: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 10,
  },
  empty: { color: colors.muted, textAlign: "center", paddingTop: 30 },
});
