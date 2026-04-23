import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import { Store } from './Store';
import { StorageService } from '../storage/StorageService';
import { TodoItem, FilterType } from '../types/index';

function makeItem(overrides: Partial<TodoItem> = {}): TodoItem {
  return {
    id: Math.random().toString(36).slice(2),
    title: 'test',
    completed: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

function makeMockStorage(todos: TodoItem[] = []): StorageService {
  const mock = { save: vi.fn(), load: vi.fn().mockReturnValue(todos) };
  return mock as unknown as StorageService;
}

describe('Store — getState / setFilter / setEditing', () => {
  it('initializes state from StorageService.load()', () => {
    const items = [makeItem({ id: '1' })];
    const store = new Store(makeMockStorage(items));
    expect(store.getState().todos).toEqual(items);
    expect(store.getState().filter).toBe('all');
    expect(store.getState().editingId).toBeNull();
  });

  it('setFilter updates filter in state', () => {
    const store = new Store(makeMockStorage());
    store.setFilter('active');
    expect(store.getState().filter).toBe('active');
    store.setFilter('completed');
    expect(store.getState().filter).toBe('completed');
    store.setFilter('all');
    expect(store.getState().filter).toBe('all');
  });

  it('setEditing updates editingId in state', () => {
    const store = new Store(makeMockStorage());
    store.setEditing('abc');
    expect(store.getState().editingId).toBe('abc');
    store.setEditing(null);
    expect(store.getState().editingId).toBeNull();
  });
});

describe('Store — getFilteredTodos', () => {
  let active: TodoItem;
  let completed: TodoItem;
  let store: Store;

  beforeEach(() => {
    active = makeItem({ id: 'a', completed: false, createdAt: 1000 });
    completed = makeItem({ id: 'b', completed: true, createdAt: 2000 });
    store = new Store(makeMockStorage([active, completed]));
  });

  it('filter "all" returns all todos', () => {
    store.setFilter('all');
    const result = store.getFilteredTodos();
    expect(result).toHaveLength(2);
  });

  it('filter "active" returns only incomplete todos', () => {
    store.setFilter('active');
    const result = store.getFilteredTodos();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });

  it('filter "completed" returns only completed todos', () => {
    store.setFilter('completed');
    const result = store.getFilteredTodos();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b');
  });

  it('results are sorted by createdAt descending (newest first)', () => {
    store.setFilter('all');
    const result = store.getFilteredTodos();
    expect(result[0].createdAt).toBeGreaterThanOrEqual(result[1].createdAt);
  });
});

// Property-based tests
// Feature: todolist-app, Property 1: getFilteredTodos returns correct subset for each filter
describe('Store — property: filter correctness', () => {
  it('filter "active" never includes completed items', () => {
    // **Validates: Requirements 2.1, 6.2**
    // Feature: todolist-app, Property 1: active filter excludes completed todos
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1 }),
            completed: fc.boolean(),
            createdAt: fc.integer({ min: 0 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (todos) => {
          const store = new Store(makeMockStorage(todos));
          store.setFilter('active');
          const result = store.getFilteredTodos();
          return result.every(t => !t.completed);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('filter "completed" never includes active items', () => {
    // **Validates: Requirements 2.1, 6.3**
    // Feature: todolist-app, Property 2: completed filter excludes active todos
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1 }),
            completed: fc.boolean(),
            createdAt: fc.integer({ min: 0 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (todos) => {
          const store = new Store(makeMockStorage(todos));
          store.setFilter('completed');
          const result = store.getFilteredTodos();
          return result.every(t => t.completed);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('filter "all" returns same count as input', () => {
    // **Validates: Requirements 2.1, 6.4**
    // Feature: todolist-app, Property 3: all filter returns all todos
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1 }),
            completed: fc.boolean(),
            createdAt: fc.integer({ min: 0 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (todos) => {
          const store = new Store(makeMockStorage(todos));
          store.setFilter('all');
          return store.getFilteredTodos().length === todos.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('results are always sorted by createdAt descending', () => {
    // **Validates: Requirements 8.2**
    // Feature: todolist-app, Property 4: todos sorted newest first
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1 }),
            completed: fc.boolean(),
            createdAt: fc.integer({ min: 0 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        fc.constantFrom<FilterType>('all', 'active', 'completed'),
        (todos, filter) => {
          const store = new Store(makeMockStorage(todos));
          store.setFilter(filter);
          const result = store.getFilteredTodos();
          for (let i = 1; i < result.length; i++) {
            if (result[i - 1].createdAt < result[i].createdAt) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
