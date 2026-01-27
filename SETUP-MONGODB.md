# 🗄️ Panduan Setup MongoDB Atlas untuk GFG App

## Langkah 1: Registrasi & Login

1. Buka <https://www.mongodb.com/cloud/atlas/register>
2. **Pilih salah satu:**
   - **Sign up with Google** (Tercepat - Recommended) ⭐
   - Atau isi form manual (First Name, Last Name, Email, Password)
3. Verifikasi email jika perlu
4. Login ke MongoDB Atlas

---

## Langkah 2: Membuat Cluster Gratis

Setelah login, Anda akan diminta membuat cluster pertama:

1. **Pilih "Build a Database"** atau klik tombol hijau "Create"

2. **Pilih Plan:**
   - Klik **"M0 FREE"** (yang paling kiri)
   - Jangan pilih yang berbayar!

3. **Pilih Provider & Region:**
   - Provider: **AWS** (biasanya default)
   - Region: Pilih yang terdekat dengan Indonesia:
     - **Singapore (ap-southeast-1)** ⭐ RECOMMENDED
     - Atau **Mumbai (ap-south-1)**
   - Cluster Name: Biarkan default atau ganti jadi `gfg-cluster`

4. **Klik "Create" / "Create Deployment"**

5. **Tunggu 3-5 menit** cluster dibuat

---

## Langkah 3: Setup Database User (PENTING!)

Setelah cluster dibuat, akan muncul popup "Security Quickstart":

### A. Create Database User

1. **Username**: Isi `gfgadmin` (atau terserah Anda)
2. **Password**: Klik "Autogenerate Secure Password" ATAU buat sendiri
   - **PENTING: COPY dan SIMPAN password ini!** ✅
3. **Klik "Create User"**

### B. Add IP Address

1. Pilih **"Add My Current IP Address"** (untuk testing lokal)
2. **Atau pilih "Allow Access from Anywhere"** (untuk deployment):
   - IP Address: `0.0.0.0/0`
   - Description: `Allow all`
3. **Klik "Add Entry"** lalu **"Finish and Close"**

---

## Langkah 4: Mendapatkan Connection String

1. **Klik "Database"** di sidebar kiri
2. Pada cluster Anda (biasanya bernama Cluster0), klik tombol **"Connect"**
3. Pilih **"Connect your application"**
4. **Driver**: Pilih **Node.js**
5. **Version**: Pilih versi terbaru (4.1 atau yang lebih baru)
6. **Copy Connection String** yang muncul, contoh:

   ```
   mongodb+srv://gfgadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **GANTI `<password>` dengan password yang Anda simpan tadi!**

   Contoh hasil akhir:

   ```
   mongodb+srv://gfgadmin:MySecurePass123@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Langkah 5: Update File .env

1. Buka file **`server/.env`** di aplikasi GFG
2. Cari baris `MONGO_URI=`
3. Ganti dengan connection string Anda:

```env
PORT=5000
MONGO_URI=mongodb+srv://gfgadmin:MySecurePass123@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=gfg_secret_token_123
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

1. **SAVE file .env**

---

## ✅ Selesai! Siap Digunakan

Sekarang Anda bisa menjalankan aplikasi:

1. Double-click **`setup.bat`** (hanya sekali pertama)
2. Double-click **`start.bat`** (untuk menjalankan app)

Database akan otomatis terbuat saat aplikasi pertama kali jalan!

---

## 🔧 Troubleshooting

### "MongoServerError: bad auth"

- Password salah
- Pastikan tidak ada karakter khusus yang perlu di-encode
- Jika password ada `@` atau `/`, ganti dengan versi URL-encoded

### "Could not connect to any servers"

- IP Address belum ditambahkan di MongoDB Atlas
- Cek Network Access di dashboard Atlas
- Pastikan internet stabil

### "Authentication failed"

- Username/password salah
- Double-check di Database Access → Database Users

---

## 📌 Tips

- **Cluster gratis (M0)** cukup untuk 512MB storage
- Bisa upgrade kapan saja kalau sudah banyak user
- Backup otomatis tersedia di plan gratis
- Dashboard Atlas bisa monitor database usage

---

**Sudah selesai setup? Jalankan `start.bat` dan akses `http://localhost:5173`!** 🚀
