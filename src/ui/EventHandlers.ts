import { FilterType } from '../types/index';
import { Store } from '../store/Store';
import { UIRenderer } from './UIRenderer';

function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (trimmed.length === 0) return 'Judul tidak boleh kosong atau hanya berisi spasi.';
  if (trimmed.length < 3) return 'Judul minimal 3 karakter.';
  if (trimmed.length > 50) return 'Judul maksimal 50 karakter.';
  return null;
}

export class EventHandlers {
  private store: Store;
  private renderer: UIRenderer;

  private addForm: HTMLFormElement;
  private addInput: HTMLInputElement;
  private addError: HTMLParagraphElement;
  private todoList: HTMLUListElement;
  private filterBtns: NodeListOf<HTMLButtonElement>;
  private clearCompletedBtn: HTMLButtonElement;

  constructor(store: Store, renderer: UIRenderer) {
    this.store = store;
    this.renderer = renderer;

    this.addForm = document.getElementById('todo-form') as HTMLFormElement;
    this.addInput = document.getElementById('todo-input') as HTMLInputElement;
    this.addError = document.getElementById('input-error') as HTMLParagraphElement;
    this.todoList = document.getElementById('todo-list') as HTMLUListElement;
    this.filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
    this.clearCompletedBtn = document.getElementById('clear-completed-btn') as HTMLButtonElement;

    this.bindEvents();
  }

  private bindEvents(): void {
    // Add todo
    this.addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddTodo();
    });

    // Todo list — delegated events
    this.todoList.addEventListener('change', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('todo-checkbox')) {
        const id = (target as HTMLInputElement).dataset.id!;
        this.store.toggleTodo(id);
        this.renderer.render(this.store.getState());
      }
    });

    this.todoList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains('todo-edit-btn')) {
        const id = target.dataset.id!;
        this.store.setEditing(id);
        this.renderer.render(this.store.getState());
        // Focus the edit input after render
        const editInput = this.todoList.querySelector<HTMLInputElement>(
          `.todo-edit-input[data-id="${id}"]`
        );
        editInput?.focus();
        return;
      }

      if (target.classList.contains('todo-save-btn')) {
        const id = target.dataset.id!;
        this.handleSaveEdit(id);
        return;
      }

      if (target.classList.contains('todo-cancel-btn')) {
        this.store.setEditing(null);
        this.renderer.render(this.store.getState());
        return;
      }

      if (target.classList.contains('todo-delete-btn')) {
        const id = target.dataset.id!;
        this.handleDeleteTodo(id);
        return;
      }
    });

    // Edit input — Enter to save, Escape to cancel
    this.todoList.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('todo-edit-input')) return;

      const id = (target as HTMLInputElement).dataset.id!;
      if (e.key === 'Enter') {
        this.handleSaveEdit(id);
      } else if (e.key === 'Escape') {
        this.store.setEditing(null);
        this.renderer.render(this.store.getState());
      }
    });

    // Filter buttons
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter as FilterType;
        this.store.setFilter(filter);
        this.renderer.render(this.store.getState());
      });
    });

    // Clear completed
    this.clearCompletedBtn.addEventListener('click', () => {
      this.store.clearCompleted();
      this.renderer.render(this.store.getState());
    });
  }

  private handleAddTodo(): void {
    const title = this.addInput.value;
    const error = validateTitle(title);

    if (error) {
      this.addError.textContent = error;
      this.addError.style.display = '';
      return;
    }

    this.addError.textContent = '';
    this.addError.style.display = 'none';
    this.store.addTodo(title);
    this.addInput.value = '';
    this.renderer.render(this.store.getState());
  }

  private handleSaveEdit(id: string): void {
    const editInput = this.todoList.querySelector<HTMLInputElement>(
      `.todo-edit-input[data-id="${id}"]`
    );
    const editError = this.todoList.querySelector<HTMLParagraphElement>(
      `.edit-error[data-id="${id}"]`
    );
    if (!editInput) return;

    const newTitle = editInput.value;
    const error = validateTitle(newTitle);

    if (error) {
      if (editError) {
        editError.textContent = error;
        editError.style.display = '';
      }
      return;
    }

    this.store.editTodo(id, newTitle);
    this.store.setEditing(null);
    this.renderer.render(this.store.getState());
  }

  private handleDeleteTodo(id: string): void {
    const confirmed = window.confirm('Hapus todo ini?');
    if (confirmed) {
      this.store.deleteTodo(id);
      this.renderer.render(this.store.getState());
    }
  }
}
