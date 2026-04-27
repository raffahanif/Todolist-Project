# TodoList App

A client-side Single Page Application (SPA) for managing personal tasks. Built with TypeScript and Vite, it runs entirely in the browser with no backend required — all data is persisted via `localStorage`.

---

## Features

- Add, edit, and delete todos
- Toggle completion status per item
- Filter todos by: All, Active, or Completed
- Bulk delete all completed todos
- Summary counter showing completed vs total tasks
- Input validation (minimum 3, maximum 50 characters)
- Data persists across page reloads via `localStorage`
- Available as a desktop application via Electron

---

## Installation

**Prerequisites:** Node.js >= 18

```bash
# Clone the repository
git clone <repository-url>
cd todolist-app

# Install dependencies
npm install
```

---

## Running the Project

```bash
# Start development server (browser)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run as Electron desktop app
npm run electron

# Build distributable desktop installer
npm run dist
```

---

## Running Tests

```bash
# Run all unit and property-based tests (single pass)
npm test
```

Tests are written with [Vitest](https://vitest.dev/) and [fast-check](https://fast-check.io/) for property-based testing.

---

## Project Structure

```
src/
├── main.ts                  # Entry point — wires all modules together
├── types/
│   └── index.ts             # TodoItem, AppState, FilterType
├── store/
│   └── Store.ts             # State management and business logic
├── storage/
│   └── StorageService.ts    # localStorage read/write
├── ui/
│   ├── UIRenderer.ts        # DOM rendering
│   └── EventHandlers.ts     # Event listeners
└── styles/
    └── main.css             # Application styles

index.html                   # App shell with base DOM elements
main.cjs                     # Electron main process
vite.config.ts               # Vite configuration
tsconfig.json                # TypeScript configuration
```
