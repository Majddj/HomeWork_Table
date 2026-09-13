import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { ScreenHeader } from "../../components/ScreenHeader";
import { colors, useThemeColors } from "../../theme";
import { storageService } from "../../services/storageService";

const TIMETABLE_URL = "http://timetable.bsufl.by/";

export function TimetableScreen() {
  const theme = useThemeColors();
  const webView = useRef<WebView>(null);
  const [url, setUrl] = useState(TIMETABLE_URL);

  useEffect(() => {
    void storageService.getTimetableUrl().then(setUrl);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <ScreenHeader
        title="Расписание"
        subtitle="Официальное расписание БГУИЯ"
      />
      <View style={styles.actions}>
        <Text style={[styles.caption, { color: theme.muted }]}>
          Обновляется с сайта timetable.bsufl.by
        </Text>
        <Pressable onPress={() => webView.current?.reload()} hitSlop={10}>
          <Ionicons name="refresh" size={22} color={theme.accent} />
        </Pressable>
      </View>
      <WebView
        ref={webView}
        source={{ uri: url }}
        style={styles.webView}
        startInLoadingState
        allowsBackForwardNavigationGestures
        onNavigationStateChange={({ url: nextUrl }) => {
          setUrl(nextUrl);
          void storageService.saveTimetableUrl(nextUrl);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  caption: { fontSize: 12 },
  webView: { flex: 1 },
});
