import { useMemo } from "react";
import type { Group, Note } from "../domain/types";
import { searchService } from "../services/searchService";

export function useSearch(query: string, groups: Group[], notes: Note[]) {
  return useMemo(
    () => searchService(query, groups, notes),
    [query, groups, notes],
  );
}
