# Implementation Plan: Todolist App

## Overview

Implementasi aplikasi frontend Todolist berbasis TypeScript + Vite dengan arsitektur MVC sederhana (UI Layer → Store Layer → Storage Layer). Setiap tahap dibangun secara inkremental, dimulai dari fondasi data model hingga integrasi penuh antarkomponen.

## Tasks

- [x] 1. Setup project dan struktur awal
  - Inisialisasi project Vite dengan template TypeScript
  - Buat struktur direktori: `src/`, `src/types/`, `src/store/`, `src/storage/`, `src/ui/`
  - Pasang dependensi: `vitest`, `fast-check`, `@vitest/ui` (opsional)
  - Konfigurasi `vitest.config.ts` untuk test environment
  - Buat file `index.html` dengan elemen DOM dasar (input, list, filter, summary)
  - _Requirements: 1.1, 2.1, 6.1_

- [x] 2. Implementasi tipe data dan model
  - [x] 2.1 Buat file `src/types/index.ts` dengan interface `TodoItem`, `AppState`, dan type `FilterType`
    - Definisikan semua interface dan type sesuai design
    - _Requirements: 1.2, 2.3, 3.1, 6.1_

- [x] 3. Implementasi Storage Layer
  - [x] 3.1 Buat `src/storage/StorageService.ts` dengan method `save(todos)` dan `load()`
    - Implementasi `save`: serialize array `TodoItem` ke JSON dan simpan ke localStorage dengan key `"todolist-app"`
    - Implementasi `load`: baca dari localStorage, parse JSON, kembalikan array `TodoItem` atau `[]` jika tidak ada/corrupt
    - Tangani exception saat localStorage tidak tersedia atau data tidak valid
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 3.2 Tulis property test untuk StorageService
    - **Property 7: Serialisasi round-trip mempertahankan data**
    - **Validates: Requirements 8.4**
    - Tag: `// Feature: todolist-app, Property 7: serialisasi round-trip`

- [x] 4. Implementasi Store Layer
  - [x] 4.1 Buat `src/store/Store.ts` dengan state awal dan method `getState()`, `setFilter()`, `setEditing()`
    - Inisialisasi state dari `StorageService.load()` saat konstruksi
    - Implementasi `getFilteredTodos()` berdasarkan `state.filter`
    - _Requirements: 2.1, 6.2, 6.3, 6.4, 8.2_

  - [ ]* 4.2 Tulis property test untuk `getFilteredTodos`
    - **Property 4: Filter mengembalikan subset yang tepat**
    - **Validates: Requirements 6.2, 6.3, 6.4**
    - Tag: `// Feature: todolist-app, Property 4: filter subset`

  - [x] 4.3 Implementasi `addTodo(title)` di Store
    - Validasi judul: trim dan cek panjang minimal 3 dan maksimal 50 karakter, tolak jika tidak valid
    - Buat `TodoItem` baru dengan UUID, `completed: false`, dan `createdAt: Date.now()`
    - Tambahkan ke state dan panggil `StorageService.save()`
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [ ]* 4.4 Tulis property test untuk `addTodo`
    - **Property 1: Penambahan todo memperbesar daftar**
    - **Validates: Requirements 1.2**
    - Tag: `// Feature: todolist-app, Property 1: penambahan memperbesar daftar`

  - [ ]* 4.5 Tulis property test untuk validasi whitespace di `addTodo`
    - **Property 2: Judul whitespace ditolak**
    - **Validates: Requirements 1.3**
    - Tag: `// Feature: todolist-app, Property 2: judul whitespace ditolak`

  - [ ]* 4.5b Tulis property test untuk validasi panjang minimum di `addTodo` dan `editTodo`
    - **Property 10: Judul terlalu pendek ditolak**
    - **Validates: Requirements 1.4, 4.4**
    - Tag: `// Feature: todolist-app, Property 10: judul terlalu pendek ditolak`

  - [ ]* 4.5c Tulis property test untuk validasi panjang maksimum di `addTodo` dan `editTodo`
    - **Property 11: Judul terlalu panjang ditolak**
    - **Validates: Requirements 1.5, 4.5**
    - Tag: `// Feature: todolist-app, Property 11: judul terlalu panjang ditolak`

  - [x] 4.6 Implementasi `toggleTodo(id)`, `editTodo(id, newTitle)`, `deleteTodo(id)`, dan `clearCompleted()` di Store
    - `toggleTodo`: balik nilai `completed` pada todo dengan id yang sesuai, simpan ke storage
    - `editTodo`: validasi `newTitle` (trim, panjang minimal 3 dan maksimal 50 karakter), update judul, simpan ke storage; no-op jika id tidak ditemukan atau judul tidak valid
    - `deleteTodo`: hapus todo dengan id yang sesuai dari array, simpan ke storage; no-op jika id tidak ditemukan
    - `clearCompleted`: hapus semua todo dengan `completed = true`, simpan ke storage
    - _Requirements: 3.1, 3.2, 4.2, 4.3, 4.4, 4.5, 5.2, 7.2_

  - [ ]* 4.7 Tulis property test untuk `toggleTodo`
    - **Property 5: Toggle status adalah operasi round-trip**
    - **Validates: Requirements 3.1, 3.2**
    - Tag: `// Feature: todolist-app, Property 5: toggle round-trip`

  - [ ]* 4.8 Tulis property test untuk `clearCompleted`
    - **Property 8: Hapus semua selesai menghilangkan semua completed**
    - **Validates: Requirements 7.2**
    - Tag: `// Feature: todolist-app, Property 8: clearCompleted`

- [x] 5. Checkpoint — Pastikan semua test Store dan Storage lulus
  - Pastikan semua test lulus, tanyakan kepada user jika ada pertanyaan.

- [x] 6. Implementasi UI Layer — Rendering
  - [x] 6.1 Buat `src/ui/UIRenderer.ts` dengan method `render(state)`
    - Render daftar todo ke DOM berdasarkan `state` (gunakan `getFilteredTodos()` dari store)
    - Tampilkan setiap todo dengan: checkbox, judul, waktu pembuatan, tombol edit, tombol hapus
    - Tampilkan teks dicoret pada todo dengan `completed = true`
    - Tampilkan pesan kosong jika tidak ada todo yang sesuai filter
    - Render ringkasan: `{completed} / {total} tugas selesai`
    - Render tombol filter aktif sesuai `state.filter`
    - Render tombol "Hapus Semua yang Selesai" — disabled jika tidak ada todo completed
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.3, 6.5, 7.1, 7.3_

  - [ ]* 6.2 Tulis property test untuk ringkasan
    - **Property 6: Ringkasan mencerminkan komposisi daftar**
    - **Validates: Requirements 3.3**
    - Tag: `// Feature: todolist-app, Property 6: ringkasan komposisi`

  - [ ]* 6.3 Tulis property test untuk tombol "Hapus Semua yang Selesai"
    - **Property 9: Tombol aktif iff ada completed**
    - **Validates: Requirements 7.1, 7.3**
    - Tag: `// Feature: todolist-app, Property 9: tombol aktif iff ada completed`

  - [x] 6.4 Implementasi mode edit inline di `UIRenderer`
    - Saat `state.editingId` tidak null, tampilkan input field berisi judul todo tersebut
    - Tampilkan tombol simpan dan tombol batal pada todo yang sedang diedit
    - _Requirements: 4.1, 4.4_

- [x] 7. Implementasi UI Layer — Event Handlers
  - [x] 7.1 Buat `src/ui/EventHandlers.ts` dan pasang semua event listener
    - Tambah todo: submit form/klik tombol tambah → validasi → `store.addTodo()` → kosongkan input → `renderer.render()`
    - Tampilkan pesan validasi jika judul kosong/whitespace/terlalu pendek/terlalu panjang saat tambah
    - Toggle todo: klik checkbox → `store.toggleTodo(id)` → `renderer.render()`
    - Klik tombol edit → `store.setEditing(id)` → `renderer.render()`
    - Simpan edit: Enter/klik simpan → validasi → `store.editTodo(id, newTitle)` → `store.setEditing(null)` → `renderer.render()`
    - Tampilkan pesan validasi jika judul kosong/whitespace/terlalu pendek/terlalu panjang saat edit
    - Batal edit: Escape/klik batal → `store.setEditing(null)` → `renderer.render()`
    - Hapus todo: klik tombol hapus → tampilkan konfirmasi → jika konfirmasi → `store.deleteTodo(id)` → `renderer.render()`
    - Filter: klik tombol filter → `store.setFilter(type)` → `renderer.render()`
    - Hapus semua selesai: klik tombol → `store.clearCompleted()` → `renderer.render()`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 6.2, 6.3, 6.4, 7.2_

  - [ ]* 7.2 Tulis property test untuk input field dikosongkan setelah penambahan
    - **Property 3: Input field dikosongkan setelah penambahan**
    - **Validates: Requirements 1.4**
    - Tag: `// Feature: todolist-app, Property 3: input field dikosongkan`

- [x] 8. Implementasi entry point dan wiring
  - [x] 8.1 Buat `src/main.ts` sebagai entry point aplikasi
    - Inisialisasi `StorageService`, `Store`, `UIRenderer`, dan `EventHandlers`
    - Panggil `renderer.render(store.getState())` untuk render awal
    - _Requirements: 8.2_

- [x] 9. Styling CSS — Neobrutalism
  - [x] 9.1 Definisikan CSS custom properties (design tokens) di `:root`
    - `--color-bg: #FFFBF0`, `--color-surface: #FFFFFF`, `--color-primary: #FFE500`
    - `--color-accent: #FF6B9D`, `--color-danger: #FF3B3B`, `--color-success: #00C853`
    - `--color-border: #000000`, `--color-text: #0D0D0D`, `--color-text-muted: #555555`
    - _Requirements: 2.3_

  - [x] 9.2 Style App Container dan layout utama
    - Container: `border: 3px solid #000`, `box-shadow: 6px 6px 0px #000`, `background: var(--color-surface)`
    - Judul app: `font-size: 2rem`, `font-weight: 900`, `text-transform: uppercase`
    - _Requirements: 2.1_

  - [x] 9.3 Style input field dan tombol tambah
    - Input: `border: 3px solid #000`, focus state dengan `box-shadow: 4px 4px 0px #000`
    - Tombol tambah: `background: var(--color-primary)`, `border: 3px solid #000`, `box-shadow: 4px 4px 0px #000`
    - Hover tombol: `transform: translate(-2px, -2px)`, shadow membesar
    - Klik tombol: `transform: translate(2px, 2px)`, shadow mengecil
    - Label tombol: `font-size: 0.85rem`, `font-weight: 700`, `text-transform: uppercase`
    - _Requirements: 1.1_

  - [x] 9.4 Style todo item (normal dan completed state)
    - Item: `border: 3px solid #000`, `box-shadow: 4px 4px 0px #000`, `margin-bottom: 8px`
    - Todo title: `font-size: 1rem`, `font-weight: 600`
    - Completed state: `background: #F0F0F0`, `opacity: 0.75`, `text-decoration: line-through`, `font-weight: 400`
    - _Requirements: 2.3, 3.1_

  - [x] 9.5 Style filter tabs
    - Tab aktif: `background: var(--color-accent)`, `border: 3px solid #000`, `box-shadow: 3px 3px 0px #000`
    - Tab tidak aktif: `background: #FFFFFF`, `border: 3px solid #000`, tanpa shadow
    - _Requirements: 6.1_

  - [x] 9.6 Style tombol "Hapus Semua yang Selesai"
    - `background: var(--color-danger)`, `color: #FFFFFF`, `border: 3px solid #000`, `box-shadow: 4px 4px 0px #000`
    - Disabled state: `opacity: 0.4`, tanpa shadow
    - _Requirements: 7.1, 7.3_

  - [x] 9.7 Style ringkasan dan badge count
    - Ringkasan: `font-weight: 700`, `font-size: 0.9rem`
    - Badge angka: `background: var(--color-primary)`, `border: 2px solid #000`, `padding: 2px 8px`
    - _Requirements: 3.3_

  - [x] 9.8 Tambahkan animasi slideDown dan fadeOut
    - `@keyframes slideDown` — slide-in dari atas saat todo ditambahkan (`150ms ease`)
    - `@keyframes fadeOut` — fade-out saat todo dihapus (`150ms ease`)
    - Style pesan kosong dan pesan validasi
    - _Requirements: 2.2, 1.3_

- [x] 10. Final Checkpoint — Pastikan semua test lulus
  - Jalankan seluruh test suite (`vitest --run`), pastikan semua lulus.
  - Pastikan semua requirements tercakup, tanyakan kepada user jika ada pertanyaan.

## Notes

- Task bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task merujuk ke requirements spesifik untuk keterlacakan
- Property test menggunakan library **fast-check** dengan minimum 100 iterasi per test
- Setiap property test diberi tag komentar: `// Feature: todolist-app, Property N: <deskripsi>`
- Unit test dan property test bersifat komplementer, keduanya direkomendasikan
