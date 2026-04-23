export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface AppState {
  todos: TodoItem[];
  filter: FilterType;
  editingId: string | null;
}
