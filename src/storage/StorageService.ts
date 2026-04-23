import { TodoItem } from '../types/index';

const STORAGE_KEY = 'todolist-app';

export class StorageService {
  save(todos: TodoItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // localStorage unavailable or quota exceeded — silently ignore
    }
  }

  load(): TodoItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as TodoItem[];
    } catch {
      // JSON parse error or localStorage unavailable
      return [];
    }
  }
}
