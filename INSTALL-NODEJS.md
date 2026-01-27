# ⚠️ INSTRUKSI PENTING: Install Node.js Dulu

## Kenapa Perlu Node.js?

Aplikasi GFG menggunakan:

- **Backend**: Node.js + Express
- **Frontend**: React (butuh Node.js untuk build)
- **Package Manager**: npm (terinstall otomatis dengan Node.js)

Tanpa Node.js, aplikasi **TIDAK BISA JALAN**.

---

## 📥 Cara Install Node.js (5-10 Menit)

### Step 1: Download Node.js

1. **Buka browser** dan kunjungi: **<https://nodejs.org/>**

2. **Klik tombol hijau besar** bertulisan:

   ```
   [Download Node.js (LTS)]
   ```

   **PENTING**: Pilih versi **LTS** (Long Term Support), BUKAN "Current"

   Contoh: Node.js 20.11.0 LTS

3. **Download akan otomatis dimulai** (file .msi sekitar 30-50 MB)

---

### Step 2: Install Node.js

1. **Buka file installer** yang sudah didownload (node-v20.x.x-x64.msi)

2. **Ikuti wizard instalasi:**
   - Welcome screen → Klik **"Next"**
   - License Agreement → Centang "I accept" → **"Next"**
   - Destination Folder → Biarkan default → **"Next"**
   - Custom Setup → Biarkan default (centang semua) → **"Next"**
   - **PENTING**: Pada layar "Tools for Native Modules":
     - **CENTANG** kotak "Automatically install the necessary tools..."
     - Klik **"Next"**
   - Klik **"Install"**

3. **Tunggu proses instalasi** (3-5 menit)

4. **Instalasi tambahan mungkin muncul** (Chocolatey, Python, etc.)
   - Klik **"Yes"** atau **"Allow"**
   - Biarkan proses selesai

5. **Klik "Finish"**

---

### Step 3: Restart Komputer ⚡ WAJIB

**HARUS RESTART** agar Node.js terdeteksi di Command Prompt!

```
Restart komputer sekarang
```

---

### Step 4: Verifikasi Instalasi

Setelah restart:

1. **Double-click file `CHECK-NODEJS.bat`**

2. **Jika muncul:**

   ```
   [OK] Node.js sudah terinstall!
   v20.11.0
   ```

   **Berarti BERHASIL!** ✅

3. **Jika muncul:**

   ```
   [X] Node.js masih belum terdeteksi
   ```

   **Ulangi restart komputer**

---

## ✅ Setelah Node.js Terinstall

Jalankan aplikasi GFG dengan urutan:

1. **Double-click `setup.bat`**
   - Install dependencies (hanya 1x pertama)
   - Tunggu 5-10 menit

2. **Double-click `start.bat`**
   - Jalankan backend & frontend
   - Browser otomatis terbuka

3. **Login admin:**
   - Email: `admingfg@gfg.org`
   - Password: `gracetoyou`

---

## 🔧 Troubleshooting

### "npm is not recognized" setelah install

- **Belum restart** → Restart komputer
- **PATH tidak ter-set** → Reinstall Node.js

### Instalasi gagal / error

- **Run as Administrator** → Klik kanan installer → "Run as administrator"
- **Antivirus** → Matikan sementara saat install

### Versi Node.js mana yang harus dipilih?

- **Selalu pilih LTS** (yang kiri)
- Jangan pilih "Current" (yang kanan)

---

## 📞 Bantuan

Jika masih ada masalah setelah install Node.js:

1. Screenshot error yang muncul
2. Jalankan `CHECK-NODEJS.bat` dan screenshot hasilnya
3. Minta bantuan dengan menunjukkan screenshot tersebut

---

**Setelah Node.js terinstall dan komputer di-restart, kembali ke `QUICKSTART.bat` untuk melanjutkan!** 🚀
