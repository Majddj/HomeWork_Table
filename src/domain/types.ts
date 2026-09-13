export type Group = {
  id: string;
  name: string;
  color: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  groupId: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppSnapshot = {
  groups: Group[];
  notes: Note[];
};
