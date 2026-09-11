import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useMemo, useState } from 'react'
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

type Group = { id: string; name: string; color: string }
type Note = { id: string; title: string; body: string; tag: string; done: boolean }

const groupsKey = 'homework-hub-groups'
const notesKey = 'homework-hub-notes'
const colors = ['#e85d75', '#e2a33d', '#4e9b7b', '#557bc5', '#956fc1', '#4b9ca8']
const initialGroups: Group[] = [
  { id: 'general', name: 'General', color: '#e85d75' },
  { id: 'math', name: 'Math', color: '#e2a33d' },
  { id: 'languages', name: 'Languages', color: '#4e9b7b' },
  { id: 'physics', name: 'Physics', color: '#557bc5' },
]
const initialNotes: Note[] = [
  { id: '1', title: 'Read chapter 4', body: 'Focus on quadratic equations.', tag: 'Math', done: false },
  { id: '2', title: 'French vocabulary', body: 'Review 20 words from the food list.', tag: 'Languages', done: false },
  { id: '3', title: 'Lab report', body: 'Finish the conclusion and attach the graph.', tag: 'Physics', done: false },
  { id: '4', title: 'History essay outline', body: 'Add two sources and a clear thesis.', tag: 'General', done: true },
]

export default function App() {
  const [groups, setGroups] = useState(initialGroups)
  const [notes, setNotes] = useState(initialNotes)
  const [activeId, setActiveId] = useState('general')
  const [groupModal, setGroupModal] = useState(false)
  const [noteModal, setNoteModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupColor, setGroupColor] = useState(colors[0])
  const [noteTitle, setNoteTitle] = useState('')
  const [noteBody, setNoteBody] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [savedGroups, savedNotes] = await Promise.all([AsyncStorage.getItem(groupsKey), AsyncStorage.getItem(notesKey)])
        if (savedGroups) setGroups(JSON.parse(savedGroups) as Group[])
        if (savedNotes) setNotes(JSON.parse(savedNotes) as Note[])
      } catch { /* Defaults keep the app usable when storage is unavailable. */ }
      setHydrated(true)
    }
    void load()
  }, [])
  useEffect(() => { if (hydrated) void AsyncStorage.setItem(groupsKey, JSON.stringify(groups)) }, [groups, hydrated])
  useEffect(() => { if (hydrated) void AsyncStorage.setItem(notesKey, JSON.stringify(notes)) }, [notes, hydrated])
  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) void navigator.serviceWorker.register('/sw.js')
  }, [])

  const activeGroup = groups.find((group) => group.id === activeId) ?? groups[0]
  const visibleNotes = useMemo(() => activeGroup.id === 'general' ? notes : notes.filter((note) => note.tag === activeGroup.name), [activeGroup, notes])
  const openCount = notes.filter((note) => !note.done).length
  const doneCount = visibleNotes.filter((note) => note.done).length

  function addGroup() {
    const name = groupName.trim()
    if (!name) return
    const group = { id: `${Date.now()}`, name, color: groupColor }
    setGroups((current) => [...current, group]); setActiveId(group.id); setGroupName(''); setGroupModal(false)
  }
  function addNote() {
    const title = noteTitle.trim()
    if (!title) return
    setNotes((current) => [{ id: `${Date.now()}`, title, body: noteBody.trim() || 'No extra details yet.', tag: activeGroup.name, done: false }, ...current])
    setNoteTitle(''); setNoteBody(''); setNoteModal(false)
  }
  function deleteNote(note: Note) {
    Alert.alert('Delete note?', note.title, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => setNotes((current) => current.filter((item) => item.id !== note.id)) }])
  }
  function deleteGroup(group: Group) {
    if (group.id === 'general') return Alert.alert('General cannot be deleted')
    Alert.alert('Delete group?', `Notes in ${group.name} will also be deleted.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => { setGroups((current) => current.filter((item) => item.id !== group.id)); setNotes((current) => current.filter((note) => note.tag !== group.name)); setActiveId('general') } }])
  }

  return <View style={styles.screen}>
    <View style={styles.header}><View><Text style={styles.brand}>homework</Text><Text style={styles.subtle}>Simple space for school</Text></View><Text style={styles.open}>{openCount} open</Text></View>
    <View style={styles.body}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupRow}>
        {groups.map((group) => <View key={group.id} style={styles.groupWrap}><Pressable style={[styles.group, group.id === activeId && styles.groupActive]} onPress={() => setActiveId(group.id)}><View style={[styles.dot, { backgroundColor: group.color }]} /><Text style={[styles.groupText, group.id === activeId && styles.activeText]}>{group.name}</Text><Text style={styles.count}>{group.id === 'general' ? notes.length : notes.filter((note) => note.tag === group.name).length}</Text></Pressable><Pressable onPress={() => deleteGroup(group)} hitSlop={8}><Text style={styles.delete}>×</Text></Pressable></View>)}
        <Pressable style={styles.addGroup} onPress={() => setGroupModal(true)}><Text style={styles.addText}>+ Group</Text></Pressable>
      </ScrollView>
      <View style={styles.titleRow}><View><Text style={styles.kicker}>GROUP</Text><Text style={styles.title}>{activeGroup.name}</Text><Text style={styles.subtle}>{visibleNotes.length} notes · {doneCount} completed</Text></View><Pressable style={styles.button} onPress={() => setNoteModal(true)}><Text style={styles.buttonText}>+ Note</Text></Pressable></View>
      <View style={styles.progress}><View style={[styles.progressFill, { width: `${visibleNotes.length ? doneCount / visibleNotes.length * 100 : 0}%` }]} /></View>
      <ScrollView contentContainerStyle={styles.notes}>
        {visibleNotes.map((note) => <View key={note.id} style={styles.note}><Pressable style={[styles.check, note.done && styles.checked]} onPress={() => setNotes((current) => current.map((item) => item.id === note.id ? { ...item, done: !item.done } : item))}><Text style={styles.checkText}>{note.done ? '✓' : ''}</Text></Pressable><View style={styles.noteCopy}><Text style={[styles.noteTitle, note.done && styles.strike]}>{note.title}</Text><Text style={[styles.noteBody, note.done && styles.strike]}>{note.body}</Text><Text style={styles.tag}>{note.tag}</Text></View><Pressable onPress={() => deleteNote(note)} hitSlop={10}><Text style={styles.delete}>×</Text></Pressable></View>)}
        {!visibleNotes.length && <Text style={styles.empty}>No notes here yet.</Text>}
      </ScrollView>
    </View>
    <Modal visible={groupModal} transparent animationType="fade" onRequestClose={() => setGroupModal(false)}><View style={styles.overlay}><View style={styles.modal}><Text style={styles.modalTitle}>New group</Text><TextInput autoFocus value={groupName} onChangeText={setGroupName} placeholder="Group name" maxLength={24} style={styles.input} /><View style={styles.colors}>{colors.map((color) => <Pressable key={color} onPress={() => setGroupColor(color)} style={[styles.swatch, { backgroundColor: color }, groupColor === color && styles.selected]} />)}</View><View style={styles.modalActions}><Pressable onPress={() => setGroupModal(false)}><Text style={styles.cancel}>Cancel</Text></Pressable><Pressable style={styles.button} onPress={addGroup}><Text style={styles.buttonText}>Create</Text></Pressable></View></View></View></Modal>
    <Modal visible={noteModal} transparent animationType="fade" onRequestClose={() => setNoteModal(false)}><View style={styles.overlay}><View style={styles.modal}><Text style={styles.modalTitle}>New note</Text><TextInput autoFocus value={noteTitle} onChangeText={setNoteTitle} placeholder="Title" style={styles.input} /><TextInput value={noteBody} onChangeText={setNoteBody} placeholder="Details" multiline style={[styles.input, styles.multiline]} /><View style={styles.modalActions}><Pressable onPress={() => setNoteModal(false)}><Text style={styles.cancel}>Cancel</Text></Pressable><Pressable style={styles.button} onPress={addNote}><Text style={styles.buttonText}>Add note</Text></Pressable></View></View></View></Modal>
  </View>
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f7f5' }, header: { paddingTop: 52, paddingHorizontal: 22, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e8e8e4' }, brand: { fontSize: 22, fontWeight: '700', color: '#20211f' }, subtle: { color: '#898b86', fontSize: 13, marginTop: 4 }, open: { color: '#73756f', fontSize: 13 }, body: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 22 }, groupRow: { gap: 8, paddingVertical: 18, alignItems: 'center' }, groupWrap: { flexDirection: 'row', alignItems: 'center' }, group: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 9, paddingHorizontal: 11, borderRadius: 7, backgroundColor: '#ededeb' }, groupActive: { backgroundColor: '#20211f' }, dot: { width: 8, height: 8, borderRadius: 8 }, groupText: { color: '#353632', fontSize: 13 }, activeText: { color: '#fff' }, count: { color: '#999b96', fontSize: 11 }, delete: { color: '#a1a39e', fontSize: 20, lineHeight: 20, marginLeft: 5 }, addGroup: { padding: 9 }, addText: { color: '#6d706a', fontSize: 13 }, titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 22, paddingBottom: 18 }, kicker: { color: '#979993', fontSize: 11, fontWeight: '700', letterSpacing: 1 }, title: { color: '#20211f', fontSize: 36, fontWeight: '700', marginVertical: 4 }, button: { backgroundColor: '#20211f', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 6 }, buttonText: { color: '#fff', fontWeight: '600', fontSize: 13 }, progress: { height: 4, backgroundColor: '#e5e5e1', marginBottom: 18 }, progressFill: { height: 4, backgroundColor: '#e85d75' }, notes: { gap: 9, paddingBottom: 35 }, note: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, backgroundColor: '#fff', borderRadius: 7, borderWidth: 1, borderColor: '#e8e8e4' }, check: { width: 21, height: 21, borderRadius: 11, borderWidth: 1, borderColor: '#c6c8c2', alignItems: 'center', justifyContent: 'center', marginTop: 1 }, checked: { backgroundColor: '#e85d75', borderColor: '#e85d75' }, checkText: { color: '#fff', fontSize: 13 }, noteCopy: { flex: 1 }, noteTitle: { color: '#252623', fontSize: 16, fontWeight: '600' }, noteBody: { color: '#777a73', fontSize: 13, marginTop: 5, lineHeight: 19 }, tag: { color: '#e85d75', fontSize: 11, fontWeight: '700', marginTop: 9 }, strike: { textDecorationLine: 'line-through', opacity: .45 }, empty: { color: '#898b86', textAlign: 'center', padding: 40 }, overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,.25)', justifyContent: 'center', padding: 22 }, modal: { backgroundColor: '#fff', borderRadius: 10, padding: 22 }, modalTitle: { color: '#20211f', fontSize: 23, fontWeight: '700', marginBottom: 18 }, input: { borderWidth: 1, borderColor: '#dedfd9', borderRadius: 6, padding: 12, fontSize: 14, marginBottom: 14, color: '#20211f' }, multiline: { minHeight: 90, textAlignVertical: 'top' }, colors: { flexDirection: 'row', gap: 12, marginBottom: 20 }, swatch: { width: 26, height: 26, borderRadius: 13 }, selected: { borderWidth: 3, borderColor: '#20211f' }, modalActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20 }, cancel: { color: '#777a73', fontSize: 14 },
})
