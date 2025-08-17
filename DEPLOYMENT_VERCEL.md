# 🚀 Vercel Deployment Guide

Panduan lengkap untuk deploy aplikasi Lomba 17 Agustus ke Vercel.

## 📋 Prerequisites

- ✅ Akun GitHub dengan repository
- ✅ Akun Vercel (gratis)
- ✅ Backend sudah di-deploy (Railway/Railway)
- ✅ MongoDB database sudah setup

## 🔧 Konfigurasi Sebelum Deploy

### 1. Environment Variables

Buat file `.env.local` dengan konfigurasi berikut:

```bash
# Backend API URL (ganti dengan URL backend Anda)
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# App Configuration
NEXT_PUBLIC_APP_NAME="Lomba 17 Agustus"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 2. Backend URL

Pastikan backend Anda sudah di-deploy dan dapat diakses. Contoh:

- Railway: `https://your-app.railway.app`
- Heroku: `https://your-app.herokuapp.com`
- DigitalOcean: `https://your-app.ondigitalocean.app`

## 🚀 Deployment Steps

### Step 1: Push ke GitHub

```bash
git add .
git commit -m "feat: prepare for vercel deployment"
git push origin main
```

### Step 2: Connect ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik "New Project"
4. Import repository Anda
5. Pilih repository `lomba-17-agustus`

### Step 3: Konfigurasi Project

**Framework Preset:** Next.js (otomatis terdeteksi)

**Root Directory:** `frontend`

**Build Command:** `npm run build`

**Output Directory:** `.next`

**Install Command:** `npm install`

### Step 4: Environment Variables

Di Vercel dashboard, tambahkan environment variables:

| Variable                  | Value                                  | Description     |
| ------------------------- | -------------------------------------- | --------------- |
| `NEXT_PUBLIC_API_URL`     | `https://your-backend-url.railway.app` | URL backend API |
| `NEXT_PUBLIC_APP_NAME`    | `Lomba 17 Agustus`                     | Nama aplikasi   |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0`                                | Versi aplikasi  |

### Step 5: Deploy

1. Klik "Deploy"
2. Tunggu proses build selesai
3. Aplikasi akan tersedia di URL yang diberikan

## 🔍 Troubleshooting

### Build Error: TypeScript

Jika ada error TypeScript:

```bash
# Install dependencies
npm install

# Check types
npm run type-check

# Fix linting issues
npm run lint --fix
```

### Build Error: ESLint

Jika ada error ESLint:

```bash
# Fix auto-fixable issues
npm run lint --fix

# Check specific file
npm run lint src/app/daftar/page.tsx
```

### API Connection Error

Jika frontend tidak bisa connect ke backend:

1. ✅ Pastikan backend running
2. ✅ Cek URL di environment variables
3. ✅ Test API endpoint di browser
4. ✅ Cek CORS settings di backend

## 📱 Post-Deployment

### 1. Test Fitur Utama

- [ ] Halaman utama loading
- [ ] Form pendaftaran berfungsi
- [ ] Koneksi ke backend
- [ ] Validasi nama duplikat
- [ ] Responsive design

### 2. Performance Check

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### 3. Security Headers

Headers sudah dikonfigurasi di `vercel.json`:

- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy

## 🔄 Update & Redeploy

### Auto-Deploy

Vercel akan otomatis deploy setiap kali ada push ke branch `main`.

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy manual
vercel --prod
```

### Rollback

Di Vercel dashboard, bisa rollback ke deployment sebelumnya jika ada masalah.

## 📊 Monitoring

### Vercel Analytics

- Page views
- Performance metrics
- Error tracking
- User behavior

### Custom Monitoring

```typescript
// Contoh custom error tracking
window.addEventListener("error", (event) => {
  console.error("App Error:", event.error);
  // Send to your analytics service
});
```

## 🎯 Best Practices

### 1. Environment Management

- ✅ Gunakan `.env.local` untuk development
- ✅ Set environment variables di Vercel
- ✅ Jangan commit `.env` files

### 2. Build Optimization

- ✅ Gunakan `next.config.ts` untuk optimization
- ✅ Enable tree shaking
- ✅ Optimize images
- ✅ Use proper TypeScript types

### 3. Security

- ✅ Validasi input di frontend dan backend
- ✅ Sanitize data sebelum render
- ✅ Use HTTPS only
- ✅ Implement proper CORS

## 🆘 Support

Jika ada masalah:

1. **Check Vercel logs** di dashboard
2. **Test locally** dengan `npm run build`
3. **Check environment variables**
4. **Verify backend connectivity**
5. **Review error logs**

## 🎉 Success!

Setelah deployment berhasil, aplikasi Anda akan tersedia di:
`https://your-app-name.vercel.app`

---

**Happy Deploying! 🚀**
