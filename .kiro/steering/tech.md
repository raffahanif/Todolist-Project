# Tech Stack

## Core
- **TypeScript** — all application logic
- **HTML5 + CSS3** — structure and styling
- **Vite** — build tool and dev server

## Testing
- **Vitest** — unit and property-based test runner
- **fast-check** — property-based testing library (minimum 100 iterations per property test)

## Storage
- **localStorage** — client-side persistence, key: `"todolist-app"`, value: JSON array of `TodoItem`

## Common Commands

```bash
# Start dev server
npm run dev

# Run tests (single pass)
npx vitest --run

# Build for production
npm run build
```

## Property-Based Test Convention
Every property test must include a tag comment:
```ts
// Feature: todolist-app, Property N: <short description>
```
