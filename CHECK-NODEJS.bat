@echo off
color 0C
echo.
echo ========================================
echo   PERHATIAN: Node.js Belum Terinstall!
echo ========================================
echo.
echo Aplikasi GFG membutuhkan Node.js untuk berjalan.
echo.
echo LANGKAH INSTALL NODE.JS:
echo.
echo 1. Buka browser dan kunjungi:
echo    https://nodejs.org/
echo.
echo 2. Download versi LTS (Recommended for Most Users)
echo    Pilih yang ada tulisan "LTS"
echo.
echo 3. Jalankan installer (.msi file)
echo    - Klik Next, Next, Next
echo    - Centang "Automatically install necessary tools"
echo    - Klik Install
echo.
echo 4. RESTART komputer setelah install selesai
echo.
echo 5. Setelah restart, double-click file ini lagi
echo    untuk mengecek apakah Node.js sudah terinstall
echo.
echo ========================================
echo.
pause
echo.
echo Mengecek Node.js...
echo.
node -v 2>nul
if errorlevel 1 (
    echo [X] Node.js masih belum terdeteksi
    echo     Pastikan sudah restart komputer
) else (
    echo [OK] Node.js sudah terinstall!
    echo.
    node -v
    echo.
    echo Sekarang Anda bisa jalankan setup.bat
)
echo.
echo ========================================
pause
