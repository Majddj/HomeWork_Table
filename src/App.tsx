import { useEffect, useMemo, useState } from "react";
import { Alert, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { BottomNav, type Tab } from "./components/BottomNav";
import { initialGroups, initialNotes } from "./domain/seedData";
import type { Group, Note } from "./domain/types";
import { CreateGroupModal } from "./features/groups/CreateGroupModal";
import { GroupListScreen } from "./features/groups/GroupListScreen";
import { HomeScreen } from "./features/home/HomeScreen";
import { NoteDetailScreen } from "./features/notes/NoteDetailScreen";
import { NoteEditorModal } from "./features/notes/NoteEditorModal";
import { NotesListScreen } from "./features/notes/NotesListScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import { SearchScreen } from "./features/search/SearchScreen";
import { TimetableScreen } from "./features/timetable/TimetableScreen";
import { colors, darkColors, lightColors, ThemeProvider } from "./theme";
import { useTheme } from "./hooks/useTheme";
import { storageService } from "./services/storageService";

export default function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [groupModal, setGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const { settings, setTheme } = useTheme();

  useEffect(() => {
    void Promise.all([
      storageService.getGroups(initialGroups),
      storageService.getNotes(initialNotes),
    ]).then(([savedGroups, savedNotes]) => {
      setGroups(savedGroups);
      setNotes(savedNotes);
      setReady(true);
    });
  }, []);
  useEffect(() => {
    if (ready) {
      void storageService.saveGroups(groups);
      void storageService.saveNotes(notes);
    }
  }, [groups, notes, ready]);
  useEffect(() => {
    if (Platform.OS === "web" && "serviceWorker" in navigator)
      void navigator.serviceWorker.register("/sw.js");
  }, []);

  const selectedGroup = selectedGroupId
    ? groups.find((group) => group.id === selectedGroupId)
    : undefined;
  const selectedNote = notes.find((note) => note.id === selectedNoteId);
  const editingNote = notes.find((note) => note.id === editingNoteId);
  const groupNotes = useMemo(
    () =>
      selectedGroup
        ? notes.filter((note) => note.groupId === selectedGroup.id)
        : [],
    [notes, selectedGroup],
  );

  function goHome() {
    setSelectedGroupId(null);
    setSelectedNoteId(null);
    setActiveTab("home");
  }
  function openGroup(id: string) {
    setSelectedGroupId(id);
    setSelectedNoteId(null);
  }
  function openNote(note: Note) {
    setSelectedGroupId(note.groupId);
    setSelectedNoteId(note.id);
  }
  function openEditor(note?: Note) {
    setEditingNoteId(note?.id ?? null);
    setEditorOpen(true);
  }
  function closeDetail() {
    setSelectedNoteId(null);
  }

  function createGroup(name: string, color: string) {
    if (editingGroupId) {
      setGroups((current) =>
        current.map((group) =>
          group.id === editingGroupId ? { ...group, name, color } : group,
        ),
      );
      setEditingGroupId(null);
      setGroupModal(false);
      return;
    }
    const group = { id: `group-${Date.now()}`, name, color };
    setGroups((current) => [...current, group]);
    setGroupModal(false);
    openGroup(group.id);
  }
  function saveNote(title: string, body: string, groupId: string) {
    const now = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (editingNote)
      setNotes((current) =>
        current.map((note) =>
          note.id === editingNote.id
            ? { ...note, title, body, groupId, updatedAt: now }
            : note,
        ),
      );
    else
      setNotes((current) => [
        {
          id: `note-${Date.now()}`,
          title,
          body,
          groupId,
          done: false,
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ]);
    setEditorOpen(false);
  }
  function deleteNote(note: Note) {
    Alert.alert("Удалить заметку?", "Это действие нельзя отменить.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          setNotes((current) => current.filter((item) => item.id !== note.id));
          closeDetail();
        },
      },
    ]);
  }
  function deleteGroup(group: Group) {
    if (groups.length === 1) return Alert.alert("Нужна хотя бы одна группа");
    Alert.alert(
      "Удалить группу?",
      `Вместе с «${group.name}» будут удалены связанные заметки. Это действие нельзя отменить.`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => {
            setGroups((current) =>
              current.filter((item) => item.id !== group.id),
            );
            setNotes((current) =>
              current.filter((note) => note.groupId !== group.id),
            );
            if (selectedGroupId === group.id) goHome();
          },
        },
      ],
    );
  }

  function screen() {
    if (selectedNote && selectedGroup)
      return (
        <NoteDetailScreen
          note={selectedNote}
          group={selectedGroup}
          onBack={closeDetail}
          onEdit={() => openEditor(selectedNote)}
          onToggle={() =>
            setNotes((current) =>
              current.map((note) =>
                note.id === selectedNote.id
                  ? { ...note, done: !note.done }
                  : note,
              ),
            )
          }
          onDelete={() => deleteNote(selectedNote)}
        />
      );
    if (selectedGroup)
      return (
        <NotesListScreen
          group={selectedGroup}
          notes={groupNotes}
          onBack={goHome}
          onSelect={openNote}
          onAdd={() => openEditor()}
        />
      );
    if (activeTab === "groups")
      return (
        <GroupListScreen
          groups={groups}
          notes={notes}
          onSelect={openGroup}
          onAdd={() => {
            setEditingGroupId(null);
            setGroupModal(true);
          }}
          onEdit={(group) => {
            setEditingGroupId(group.id);
            setGroupModal(true);
          }}
          onDelete={deleteGroup}
        />
      );
    if (activeTab === "search")
      return (
        <SearchScreen
          groups={groups}
          notes={notes}
          onSelect={openNote}
          onSelectGroup={openGroup}
        />
      );
    if (activeTab === "schedule")
       return <TimetableScreen />;
    
    if (activeTab === "profile")
      return (
        <ProfileScreen
          groups={groups}
          notes={notes}
          theme={settings.theme}
          onThemeChange={setTheme}
        />
      );
    return (
      <HomeScreen
        groups={groups}
        notes={notes}
        onGroupSelect={openGroup}
        onAddGroup={() => setGroupModal(true)}
      />
    );
  }

  return (
    <ThemeProvider mode={settings.theme}>
      <SafeAreaView
        style={[
          styles.app,
          {
            backgroundColor:
              settings.theme === "dark"
                ? darkColors.canvas
                : lightColors.canvas,
          },
        ]}
      >
        <View style={styles.content}>{screen()}</View>
        {!selectedNote && (
          <BottomNav
            active={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setSelectedGroupId(null);
              setSelectedNoteId(null);
            }}
          />
        )}
        <CreateGroupModal
          visible={groupModal}
          initialGroup={groups.find((group) => group.id === editingGroupId)}
          onClose={() => {
            setEditingGroupId(null);
            setGroupModal(false);
          }}
          onCreate={createGroup}
        />
        {selectedGroup && (
          <NoteEditorModal
            visible={editorOpen}
            group={selectedGroup}
            groups={groups}
            note={editingNote}
            onClose={() => setEditorOpen(false)}
            onSave={saveNote}
          />
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.canvas },
  content: { flex: 1, maxWidth: 760, width: "100%", alignSelf: "center" },
});
