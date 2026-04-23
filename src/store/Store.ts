import { AppState, FilterType, TodoItem } from '../types/index';
import { StorageService } from '../storage/StorageService';

export class Store {
  private state: AppState;
  private storage: StorageService;

  constructor(storage: StorageService = new StorageService()) {
    this.storage = storage;
    this.state = {
      todos: this.storage.load(),
      filter: 'all',
      editingId: null,
    };
  }

  getState(): AppState {
    return this.state;
  }

  setFilter(filter: FilterType): void {
    this.state = { ...this.state, filter };
  }

  setEditing(id: string | null): void {
    this.state = { ...this.state, editingId: id };
  }

  addTodo(title: string): void {
    const trimmed = title.trim();
    if (trimmed.length < 3 || trimmed.length > 50) return;

    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    this.state = { ...this.state, todos: [...this.state.todos, newItem] };
    this.storage.save(this.state.todos);
  }

  toggleTodo(id: string): void {
    const todo = this.state.todos.find(t => t.id === id);
    if (!todo) return;
    this.state = {
      ...this.state,
      todos: this.state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    };
    this.storage.save(this.state.todos);
  }

  editTodo(id: string, newTitle: string): void {
    const trimmed = newTitle.trim();
    if (trimmed.length < 3 || trimmed.length > 50) return;
    const todo = this.state.todos.find(t => t.id === id);
    if (!todo) return;
    this.state = {
      ...this.state,
      todos: this.state.todos.map(t => t.id === id ? { ...t, title: trimmed } : t),
    };
    this.storage.save(this.state.todos);
  }

  deleteTodo(id: string): void {
    if (!this.state.todos.find(t => t.id === id)) return;
    this.state = {
      ...this.state,
      todos: this.state.todos.filter(t => t.id !== id),
    };
    this.storage.save(this.state.todos);
  }

  clearCompleted(): void {
    this.state = {
      ...this.state,
      todos: this.state.todos.filter(t => !t.completed),
    };
    this.storage.save(this.state.todos);
  }

  getFilteredTodos(): TodoItem[] {
    const { todos, filter } = this.state;
    let filtered: TodoItem[];

    if (filter === 'active') {
      filtered = todos.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = todos.filter(t => t.completed);
    } else {
      filtered = [...todos];
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }
}
