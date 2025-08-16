# Deployment Instructions - Frontend

## Setup untuk Vercel Deployment

### 1. Environment Variables
Buat file `.env.local` di root folder frontend dengan konfigurasi berikut:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Untuk production, ganti dengan URL backend yang di-deploy
# NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

### 2. Vercel Deployment

1. **Push ke GitHub Repository**
   ```bash
   git add .
   git commit -m "Add realtime peserta list with backend integration"
   git push origin main
   ```

2. **Deploy ke Vercel**
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Import repository `sandyfirdaus1/lomba-17-agustus`
   - Set environment variable:
     - `NEXT_PUBLIC_API_URL`: URL backend yang sudah di-deploy

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Dependencies yang Diperlukan

Pastikan semua dependencies sudah terinstall:
```bash
npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-select
```

### 4. Fitur yang Tersedia

- ✅ Halaman pendaftaran peserta dengan validasi usia
- ✅ Halaman daftar peserta realtime dengan filter kategori lomba
- ✅ Auto-refresh setiap 30 detik
- ✅ Statistik peserta (total, hari ini, lomba terpopuler)
- ✅ Responsive design untuk mobile dan desktop
- ✅ Integrasi dengan backend API

### 5. URL Routes

- `/` - Halaman beranda
- `/daftar` - Form pendaftaran peserta
- `/peserta` - Daftar peserta realtime
- `/admin` - Panel admin (jika diperlukan)

### 6. Troubleshooting

Jika ada error CORS:
1. Pastikan backend sudah mengaktifkan CORS
2. Periksa URL API di environment variable
3. Pastikan backend sudah running dan accessible

Jika ada error build:
1. Periksa semua dependencies sudah terinstall
2. Pastikan TypeScript types sudah benar
3. Periksa import statements
