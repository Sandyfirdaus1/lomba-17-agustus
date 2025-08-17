# 🔧 Perbaiki Error Pendaftaran di Vercel

## 🚨 **Masalah:**

Frontend tidak bisa mendaftar peserta karena tidak bisa terhubung ke backend di Vercel.

## ✅ **Solusi:**

### **1. Set Environment Variable di Vercel Frontend**

1. **Buka Vercel Dashboard**

   - Login ke [vercel.com](https://vercel.com)
   - Pilih project frontend Anda

2. **Tambahkan Environment Variable**

   - Klik tab **"Settings"**
   - Pilih **"Environment Variables"**
   - Klik **"Add New"**
   - Isi dengan:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://your-backend-url.vercel.app
     Environment: Production, Preview, Development
     ```
   - **Ganti `your-backend-url`** dengan URL backend Vercel Anda yang sebenarnya

3. **Redeploy Frontend**
   - Klik **"Redeploy"** di tab **"Deployments"**
   - Atau push perubahan baru ke GitHub

### **2. Pastikan Backend Sudah Deploy**

1. **Deploy Backend dulu** (jika belum):

   ```bash
   cd backend
   vercel --prod
   ```

2. **Set Environment Variables di Backend Vercel:**
   - `MONGODB_URI`: URL MongoDB Atlas Anda
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `*`

### **3. Test Koneksi**

1. **Test Backend Health Check:**

   ```
   https://your-backend-url.vercel.app/health
   ```

   Harus return: `{"status":"ok","database":"connected"}`

2. **Test API Endpoint:**
   ```
   https://your-backend-url.vercel.app/api/peserta
   ```
   Harus return list peserta atau error yang proper

### **4. Debugging**

Jika masih error, cek:

1. **Browser Console** - Lihat error detail
2. **Vercel Logs** - Cek deployment logs
3. **Network Tab** - Lihat request/response

### **5. Contoh Environment Variable yang Benar**

```
NEXT_PUBLIC_API_URL=https://lomba-17-agustus-backend.vercel.app
```

**Pastikan:**

- ✅ URL backend benar dan bisa diakses
- ✅ Environment variable diset di **Production**
- ✅ Frontend di-redeploy setelah set environment variable

## 🎯 **Langkah Cepat:**

1. **Copy URL backend Vercel Anda**
2. **Set `NEXT_PUBLIC_API_URL` di Vercel dashboard**
3. **Redeploy frontend**
4. **Test pendaftaran**

Setelah ini, pendaftaran seharusnya bisa berjalan normal! 🚀
