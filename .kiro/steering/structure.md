# Project Structure

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
vitest.config.ts             # Test configuration
```

## Architecture

Three-layer MVC pattern:

```
UI Layer (UIRenderer + EventHandlers)
    ↕
Store Layer (Store — state + business logic)
    ↕
Storage Layer (StorageService — localStorage)
```

- UI reads state from Store and dispatches actions back to it
- Store persists to Storage on every mutation
- Storage loads initial state on app startup

## Key Conventions
- All source files in `src/`, organized by layer
- Types centralized in `src/types/index.ts`
- Each layer is a single class/module with a clear interface
- No backend — everything runs in the browser
