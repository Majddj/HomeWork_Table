import { useEffect, useState } from "react";
import { storageService, type Settings } from "../services/storageService";

export function useTheme() {
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    userName: "Студент БГУИР",
  });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void storageService.getSettings(settings).then((saved) => {
      setSettings(saved);
      setReady(true);
    });
  }, []);
  useEffect(() => {
    if (ready) void storageService.saveSettings(settings);
  }, [settings, ready]);
  return {
    settings,
    setTheme: (theme: Settings["theme"]) =>
      setSettings((current) => ({ ...current, theme })),
    setUserName: (userName: string) =>
      setSettings((current) => ({ ...current, userName })),
  };
}
