# 🚀 Project Setup Guide

![Alt text](Image\a.png)

## 🟢 1. Install Node.js

Unduh dan install Node.js dari situs resmi:

🔗 [https://nodejs.org/en/download](https://nodejs.org/en/download)  
Pilih installer Windows `.msi` dan ikuti petunjuk pemasangan.

---

## 📦 2. Install Dependencies

Buka terminal di direktori project, lalu jalankan:

```bash
npm install
```

---

## 🛠️ 3. Jalankan Mode Development

Untuk memulai server development:

```bash
npm run dev
```

Setelah itu, buka browser dan akses:

👉 [http://localhost:3000](http://localhost:3000)

## 🗄️ Build in Docker  (Optional)

```bash
docker-compose up --build
```

## 🗄️ Docker : Restore MongoDB Database (Optional )

Jika kamu ingin merestore data MongoDB ke container Docker, ikuti langkah-langkah berikut:

### 📁 1. Salin Folder Backup ke Container

> Ganti path sesuai lokasi backup di komputermu (`E:\mongo-backup\mydatabase`)

```bash
docker cp "E:\mongo-backup\mydatabase" the-day-21-app-mongo-1:/backup
```

### ♻️ 2. Jalankan Perintah Restore

```bash
docker exec -it the-day-21-app-mongo-1 mongorestore --username admin --password password --authenticationDatabase admin --drop --db mydatabase /backup/mydatabase
```
> Pastikan username dan password sesuai dengan konfigurasi MongoDB di dalam container.
---

📌 **Catatan:** Pastikan container MongoDB (`the-day-21-app-mongo-1`) sedang berjalan sebelum melakukan restore.
