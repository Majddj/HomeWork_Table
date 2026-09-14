import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { ScreenHeader } from "../../components/ScreenHeader";
import { colors, useThemeColors } from "../../theme";
import { storageService } from "../../services/storageService";

const TIMETABLE_URL = "http://timetable.bsufl.by/";

export function TimetableScreen() {
  const theme = useThemeColors();

  const webView = useRef<WebView>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [url, setUrl] = useState(TIMETABLE_URL);
  const [webError, setWebError] = useState(false);

  useEffect(() => {
    void storageService.getTimetableUrl().then((savedUrl) => {
      if (savedUrl) {
        setUrl(savedUrl);
      }
    });
  }, []);

  const reload = () => {
    if (Platform.OS === "web") {
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
    } else {
      webView.current?.reload();
    }
  };

  const handleNavigation = (nextUrl: string) => {
    setUrl(nextUrl);
    void storageService.saveTimetableUrl(nextUrl);
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.canvas },
      ]}
    >
      <ScreenHeader
        title="Расписание"
        subtitle="Официальное расписание БГУИЯ"
      />

      <View style={styles.actions}>
        <Text
          style={[
            styles.caption,
            { color: theme.muted },
          ]}
        >
          Обновляется с сайта timetable.bsufl.by
        </Text>

        <Pressable onPress={reload} hitSlop={10}>
          <Ionicons
            name="refresh"
            size={22}
            color={theme.accent}
          />
        </Pressable>
      </View>

      {Platform.OS === "web" ? (
        <View style={styles.webContainer}>
          {webError ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={theme.accent}
              />

              <Text
                style={[
                  styles.errorTitle,
                  { color: theme.text },
                ]}
              >
                Расписание нельзя встроить
              </Text>

              <Text
                style={[
                  styles.errorText,
                  { color: theme.muted },
                ]}
              >
                Официальный сайт расписания не разрешает
                отображение внутри приложения.
              </Text>

              <Pressable
                style={[
                  styles.openButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={() => {
                  window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                <Text style={styles.openButtonText}>
                  Открыть расписание
                </Text>
              </Pressable>
            </View>
          ) : (
            <iframe
              ref={iframeRef}
              src={url}
              title="Расписание БГУИЯ"
              onError={() => setWebError(true)}
              style={styles.iframe}
            />
          )}
        </View>
      ) : (
        <WebView
          ref={webView}
          source={{ uri: url }}
          style={styles.webView}
          startInLoadingState
          allowsBackForwardNavigationGestures
          onNavigationStateChange={({ url: nextUrl }) => {
            handleNavigation(nextUrl);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  caption: {
    fontSize: 12,
  },

  webContainer: {
    flex: 1,
    overflow: "hidden",
  },

  iframe: {
    width: "100%",
    height: "100%",
    borderWidth: 0,
  } as any,

  webView: {
    flex: 1,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  errorText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 420,
  },

  openButton: {
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
  },

  openButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});