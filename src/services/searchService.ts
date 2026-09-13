import type { Group, Note } from "../domain/types";

export type SearchResult = {
  type: "group" | "note";
  id: string;
  title: string;
  groupId?: string;
};

export function searchService(
  query: string,
  groups: Group[],
  notes: Note[],
): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const groupResults = groups
    .filter((group) => group.name.toLowerCase().includes(normalized))
    .map((group) => ({
      type: "group" as const,
      id: group.id,
      title: group.name,
    }));
  const noteResults = notes
    .filter((note) =>
      `${note.title} ${note.body}`.toLowerCase().includes(normalized),
    )
    .map((note) => ({
      type: "note" as const,
      id: note.id,
      title: note.title,
      groupId: note.groupId,
    }));
  return [...groupResults, ...noteResults];
}
