# Requirements Document

## Introduction

Aplikasi frontend Todolist adalah aplikasi berbasis web yang memungkinkan pengguna untuk mengelola daftar tugas (todo) secara efisien. Pengguna dapat membuat, membaca, memperbarui, dan menghapus tugas, serta menandai tugas sebagai selesai. Aplikasi ini berjalan sepenuhnya di sisi klien (frontend) dengan penyimpanan data menggunakan localStorage browser.

## Glossary

- **App**: Aplikasi frontend Todolist secara keseluruhan
- **Todo**: Satu item tugas yang memiliki judul, status, dan waktu pembuatan
- **Todo_List**: Kumpulan semua item Todo yang dimiliki pengguna
- **Filter**: Mekanisme untuk menampilkan subset Todo berdasarkan kriteria tertentu
- **Storage**: Mekanisme penyimpanan data berbasis localStorage browser
- **User**: Pengguna akhir yang berinteraksi dengan aplikasi melalui browser

## Requirements

### Requirement 1: Membuat Todo Baru

**User Story:** Sebagai User, saya ingin membuat todo baru, agar saya dapat mencatat tugas yang perlu dikerjakan.

#### Acceptance Criteria

1. THE App SHALL menyediakan input field untuk memasukkan judul Todo baru.
2. WHEN User memasukkan judul Todo dan menekan tombol tambah atau menekan tombol Enter, THE App SHALL menambahkan Todo baru ke Todo_List dengan status "belum selesai" dan waktu pembuatan saat ini.
3. IF User mencoba menambahkan Todo dengan judul kosong atau hanya berisi spasi, THEN THE App SHALL menampilkan pesan validasi dan tidak menambahkan Todo ke Todo_List.
4. IF User mencoba menambahkan Todo dengan judul yang setelah di-trim memiliki panjang kurang dari 3 karakter, THEN THE App SHALL menampilkan pesan validasi dan tidak menambahkan Todo ke Todo_List.
5. IF User mencoba menambahkan Todo dengan judul yang setelah di-trim memiliki panjang lebih dari 50 karakter, THEN THE App SHALL menampilkan pesan validasi dan tidak menambahkan Todo ke Todo_List.
6. WHEN Todo baru berhasil ditambahkan, THE App SHALL mengosongkan input field secara otomatis.

---

### Requirement 2: Menampilkan Daftar Todo

**User Story:** Sebagai User, saya ingin melihat semua todo saya, agar saya dapat mengetahui tugas apa saja yang perlu dikerjakan.

#### Acceptance Criteria

1. THE App SHALL menampilkan semua Todo dalam Todo_List secara berurutan berdasarkan waktu pembuatan terbaru di atas.
2. WHEN Todo_List kosong, THE App SHALL menampilkan pesan informasi bahwa belum ada tugas yang ditambahkan.
3. THE App SHALL menampilkan judul, status (selesai/belum selesai), dan waktu pembuatan untuk setiap Todo.

---

### Requirement 3: Menandai Todo Sebagai Selesai

**User Story:** Sebagai User, saya ingin menandai todo sebagai selesai, agar saya dapat melacak progres pekerjaan saya.

#### Acceptance Criteria

1. WHEN User mencentang checkbox pada sebuah Todo, THE App SHALL mengubah status Todo tersebut menjadi "selesai" dan menampilkan tampilan visual yang berbeda (misalnya teks dicoret).
2. WHEN User menghapus centang checkbox pada sebuah Todo yang berstatus "selesai", THE App SHALL mengubah status Todo tersebut kembali menjadi "belum selesai".
3. THE App SHALL menampilkan jumlah Todo yang telah selesai dan total Todo pada bagian ringkasan.

---

### Requirement 4: Mengedit Todo

**User Story:** Sebagai User, saya ingin mengedit judul todo yang sudah ada, agar saya dapat memperbaiki atau memperbarui informasi tugas.

#### Acceptance Criteria

1. WHEN User mengklik tombol edit pada sebuah Todo, THE App SHALL menampilkan input field yang berisi judul Todo saat ini untuk diedit.
2. WHEN User menyimpan perubahan dengan menekan tombol simpan atau menekan tombol Enter, THE App SHALL memperbarui judul Todo dengan nilai baru.
3. IF User mencoba menyimpan Todo dengan judul kosong atau hanya berisi spasi, THEN THE App SHALL menampilkan pesan validasi dan tidak menyimpan perubahan.
4. IF User mencoba menyimpan Todo dengan judul yang setelah di-trim memiliki panjang kurang dari 3 karakter, THEN THE App SHALL menampilkan pesan validasi dan tidak menyimpan perubahan.
5. IF User mencoba menyimpan Todo dengan judul yang setelah di-trim memiliki panjang lebih dari 50 karakter, THEN THE App SHALL menampilkan pesan validasi dan tidak menyimpan perubahan.
6. WHEN User membatalkan pengeditan dengan menekan tombol batal atau menekan tombol Escape, THE App SHALL menutup mode edit tanpa menyimpan perubahan.

---

### Requirement 5: Menghapus Todo

**User Story:** Sebagai User, saya ingin menghapus todo yang tidak relevan, agar Todo_List tetap bersih dan terorganisir.

#### Acceptance Criteria

1. WHEN User mengklik tombol hapus pada sebuah Todo, THE App SHALL menampilkan konfirmasi penghapusan.
2. WHEN User mengkonfirmasi penghapusan, THE App SHALL menghapus Todo dari Todo_List secara permanen.
3. WHEN User membatalkan konfirmasi penghapusan, THE App SHALL menutup dialog konfirmasi tanpa menghapus Todo.

---

### Requirement 6: Memfilter Todo

**User Story:** Sebagai User, saya ingin memfilter todo berdasarkan statusnya, agar saya dapat fokus pada tugas yang relevan.

#### Acceptance Criteria

1. THE App SHALL menyediakan Filter dengan tiga pilihan: "Semua", "Belum Selesai", dan "Selesai".
2. WHEN User memilih Filter "Semua", THE App SHALL menampilkan seluruh Todo dalam Todo_List.
3. WHEN User memilih Filter "Belum Selesai", THE App SHALL menampilkan hanya Todo dengan status "belum selesai".
4. WHEN User memilih Filter "Selesai", THE App SHALL menampilkan hanya Todo dengan status "selesai".
5. WHEN tidak ada Todo yang sesuai dengan Filter yang dipilih, THE App SHALL menampilkan pesan informasi bahwa tidak ada tugas yang sesuai.

---

### Requirement 7: Menghapus Semua Todo yang Selesai

**User Story:** Sebagai User, saya ingin menghapus semua todo yang sudah selesai sekaligus, agar saya dapat membersihkan daftar dengan cepat.

#### Acceptance Criteria

1. THE App SHALL menyediakan tombol "Hapus Semua yang Selesai" yang hanya aktif ketika terdapat minimal satu Todo dengan status "selesai".
2. WHEN User mengklik tombol "Hapus Semua yang Selesai", THE App SHALL menghapus semua Todo dengan status "selesai" dari Todo_List.
3. WHILE tidak ada Todo dengan status "selesai", THE App SHALL menonaktifkan tombol "Hapus Semua yang Selesai".

---

### Requirement 8: Persistensi Data

**User Story:** Sebagai User, saya ingin data todo saya tersimpan secara otomatis, agar saya tidak kehilangan data ketika menutup atau me-refresh browser.

#### Acceptance Criteria

1. WHEN User melakukan perubahan pada Todo_List (tambah, edit, hapus, ubah status), THE App SHALL menyimpan Todo_List ke Storage secara otomatis.
2. WHEN App pertama kali dimuat, THE App SHALL memuat Todo_List dari Storage jika data tersedia.
3. IF Storage tidak tersedia atau data di Storage tidak valid, THEN THE App SHALL memulai dengan Todo_List kosong tanpa menampilkan error kepada User.
4. THE Storage SHALL menyimpan data Todo_List dalam format JSON yang dapat di-parse kembali menjadi Todo_List yang ekuivalen (round-trip property).
