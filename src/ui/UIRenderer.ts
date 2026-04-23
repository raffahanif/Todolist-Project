import { AppState, FilterType, TodoItem } from '../types/index';
import { Store } from '../store/Store';

export class UIRenderer {
  private store: Store;

  private todoList: HTMLUListElement;
  private emptyMessage: HTMLParagraphElement;
  private summary: HTMLParagraphElement;
  private clearCompletedBtn: HTMLButtonElement;
  private filterBtns: NodeListOf<HTMLButtonElement>;

  constructor(store: Store) {
    this.store = store;
    this.todoList = document.getElementById('todo-list') as HTMLUListElement;
    this.emptyMessage = document.getElementById('empty-message') as HTMLParagraphElement;
    this.summary = document.getElementById('summary') as HTMLParagraphElement;
    this.clearCompletedBtn = document.getElementById('clear-completed-btn') as HTMLButtonElement;
    this.filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  }

  render(state: AppState): void {
    const filtered = this.store.getFilteredTodos();
    const { todos, filter, editingId } = state;

    this.renderTodoList(filtered, editingId);
    this.renderEmptyMessage(filtered, filter);
    this.renderSummary(todos);
    this.renderClearCompletedBtn(todos);
    this.renderFilterButtons(filter);
  }

  private renderTodoList(todos: TodoItem[], editingId: string | null): void {
    this.todoList.innerHTML = '';
    for (const todo of todos) {
      const li = this.createTodoItem(todo, editingId);
      this.todoList.appendChild(li);
    }
  }

  private createTodoItem(todo: TodoItem, editingId: string | null): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    li.dataset.id = todo.id;

    if (editingId === todo.id) {
      li.appendChild(this.createEditView(todo));
    } else {
      li.appendChild(this.createDisplayView(todo));
    }

    return li;
  }

  private createDisplayView(todo: TodoItem): DocumentFragment {
    const frag = document.createDocumentFragment();

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Tandai "${todo.title}" sebagai selesai`);
    checkbox.dataset.id = todo.id;

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'todo-title' + (todo.completed ? ' strikethrough' : '');
    titleSpan.textContent = todo.title;

    // Created at
    const timeSpan = document.createElement('span');
    timeSpan.className = 'todo-time';
    timeSpan.textContent = this.formatDate(todo.createdAt);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'todo-edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.dataset.id = todo.id;
    editBtn.setAttribute('aria-label', `Edit "${todo.title}"`);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete-btn';
    deleteBtn.textContent = 'Hapus';
    deleteBtn.dataset.id = todo.id;
    deleteBtn.setAttribute('aria-label', `Hapus "${todo.title}"`);

    frag.appendChild(checkbox);
    frag.appendChild(titleSpan);
    frag.appendChild(timeSpan);
    frag.appendChild(editBtn);
    frag.appendChild(deleteBtn);

    return frag;
  }

  private createEditView(todo: TodoItem): DocumentFragment {
    const frag = document.createDocumentFragment();

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-edit-input';
    input.value = todo.title;
    input.dataset.id = todo.id;
    input.setAttribute('aria-label', `Edit judul todo`);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'todo-save-btn';
    saveBtn.textContent = 'Simpan';
    saveBtn.dataset.id = todo.id;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'todo-cancel-btn';
    cancelBtn.textContent = 'Batal';
    cancelBtn.dataset.id = todo.id;

    const editError = document.createElement('p');
    editError.className = 'error-message edit-error';
    editError.setAttribute('aria-live', 'polite');
    editError.dataset.id = todo.id;

    frag.appendChild(input);
    frag.appendChild(saveBtn);
    frag.appendChild(cancelBtn);
    frag.appendChild(editError);

    return frag;
  }

  private renderEmptyMessage(filtered: TodoItem[], filter: FilterType): void {
    if (filtered.length === 0) {
      this.emptyMessage.style.display = '';
      this.emptyMessage.textContent =
        filter === 'all'
          ? 'Belum ada tugas yang ditambahkan.'
          : filter === 'active'
          ? 'Tidak ada tugas yang belum selesai.'
          : 'Tidak ada tugas yang sudah selesai.';
    } else {
      this.emptyMessage.style.display = 'none';
    }
  }

  private renderSummary(todos: TodoItem[]): void {
    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;
    this.summary.innerHTML =
      `<span class="badge">${completed}</span> / <span class="badge">${total}</span> tugas selesai`;
  }

  private renderClearCompletedBtn(todos: TodoItem[]): void {
    const hasCompleted = todos.some(t => t.completed);
    this.clearCompletedBtn.disabled = !hasCompleted;
  }

  private renderFilterButtons(filter: FilterType): void {
    this.filterBtns.forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  private formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
