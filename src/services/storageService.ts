import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Group, Note } from "../domain/types";

type Settings = { theme: "light" | "dark"; userName: string };

const keys = {
  groups: "bsuir-groups",
  notes: "bsuir-notes",
  settings: "bsuir-settings",
  timetable: "bsuir-timetable-url",
};

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const storageService = {
  getGroups: (fallback: Group[]) => read(keys.groups, fallback),
  saveGroups: (groups: Group[]) =>
    AsyncStorage.setItem(keys.groups, JSON.stringify(groups)),
  getNotes: (fallback: Note[]) => read(keys.notes, fallback),
  saveNotes: (notes: Note[]) =>
    AsyncStorage.setItem(keys.notes, JSON.stringify(notes)),
  getSettings: (fallback: Settings) => read(keys.settings, fallback),
  saveSettings: (settings: Settings) =>
    AsyncStorage.setItem(keys.settings, JSON.stringify(settings)),
  getTimetableUrl: () => read(keys.timetable, "http://timetable.bsufl.by/"),
  saveTimetableUrl: (url: string) =>
    AsyncStorage.setItem(keys.timetable, JSON.stringify(url)),
  clearStorage: () => AsyncStorage.multiRemove(Object.values(keys)),
};

export type { Settings };
