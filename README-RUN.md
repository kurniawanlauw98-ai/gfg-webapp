# 🚀 Cara Menjalankan GFG App

## Pertama Kali (Setup)

1. **Pastikan Node.js sudah terinstall**
   - Download dari: <https://nodejs.org/>
   - Pilih versi LTS
   - Restart komputer setelah install

2. **Setup MongoDB**

   **Opsi A - MongoDB Atlas (Recommended - Gratis):**
   - Buat akun di <https://www.mongodb.com/cloud/atlas>
   - Buat cluster gratis
   - Klik "Connect" → "Connect your application"
   - Copy connection string
   - Paste di `server/.env` → bagian `MONGO_URI`

   **Opsi B - MongoDB Lokal:**
   - Download dari <https://www.mongodb.com/try/download/community>
   - Install dan jalankan service
   - Biarkan `MONGO_URI=mongodb://localhost:27017/gfg_db`

3. **Jalankan Setup**
   - Double-click file `setup.bat`
   - Tunggu sampai selesai install dependencies

## Menjalankan Aplikasi

1. **Double-click file `start.bat`**
   - Akan membuka 2 terminal:
     - Terminal 1: Backend Server (port 5000)
     - Terminal 2: Frontend Dev Server (port 5173)

2. **Buka Browser**
   - Ketik: `http://localhost:5173`

3. **Login Admin**
   - Email: `admingfg@gfg.org`
   - Password: `gracetoyou`

## Troubleshooting

### Error "npm is not recognized"

- Node.js belum terinstall atau belum di-restart
- Restart komputer setelah install Node.js

### Error "Cannot connect to MongoDB"

- Pastikan MongoDB sudah running (jika pakai lokal)
- Atau pastikan `MONGO_URI` sudah benar di `server/.env`

### Port sudah digunakan

- Matikan aplikasi lain yang pakai port 5000 atau 5173
- Atau ubah PORT di `server/.env`

## Menghentikan Aplikasi

- Tutup kedua terminal yang terbuka
- Atau tekan `Ctrl + C` di masing-masing terminal
