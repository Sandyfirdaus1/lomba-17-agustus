# 🏆 Lomba 17 Agustus - Project Structure

Project ini terdiri dari **2 repository terpisah** untuk backend dan frontend.

## 📁 **Struktur Repository**

### **Repository 1: Backend**

- **URL:** `https://github.com/username/lomba-17-agustus-backend`
- **Tech Stack:** Node.js, Express, MongoDB Atlas
- **Fitur:** API untuk pendaftaran dan pengelolaan peserta

### **Repository 2: Frontend**

- **URL:** `https://github.com/username/lomba-17-agustus-frontend`
- **Tech Stack:** React/Next.js
- **Fitur:** UI untuk pendaftaran dan melihat daftar peserta

## 🚀 **Setup Development**

### **1. Clone Backend Repository**

```bash
git clone https://github.com/username/lomba-17-agustus-backend.git
cd lomba-17-agustus-backend
npm install
cp env.example .env
# Edit .env dengan credentials MongoDB
npm run dev
```

### **2. Clone Frontend Repository**

```bash
git clone https://github.com/username/lomba-17-agustus-frontend.git
cd lomba-17-agustus-frontend
npm install
npm run dev
```

## 🔐 **Security & Environment Variables**

- ✅ **Backend:** Credentials MongoDB di file `.env` (tidak masuk GitHub)
- ✅ **Frontend:** API URL di environment variables
- ✅ **Database:** MongoDB Atlas dengan IP whitelist

## 🌐 **Deployment**

### **Backend Deployment Options:**

- **Heroku** - Set environment variables di dashboard
- **Railway** - Auto-deploy dari GitHub
- **Render** - Free tier available
- **Vercel** - Serverless functions

### **Frontend Deployment Options:**

- **Vercel** - Auto-deploy dari GitHub
- **Netlify** - Free hosting
- **GitHub Pages** - Static hosting

## 📱 **Fitur Utama**

- ✅ **Public Access** - Semua orang bisa lihat daftar peserta
- ✅ **Real-time Data** - Update otomatis dari database
- ✅ **Mobile Friendly** - Responsive design
- ✅ **No Authentication** - Lihat daftar tanpa login

## 🔗 **API Endpoints**

Backend menyediakan API:

- `GET /api/peserta` - Lihat semua peserta (PUBLIC)
- `POST /api/peserta` - Daftar peserta baru
- `GET /api/peserta/stats/summary` - Statistik peserta

## 📋 **Langkah Selanjutnya**

1. **Buat repository GitHub terpisah** untuk backend dan frontend
2. **Push code** ke masing-masing repository
3. **Setup deployment** di platform yang dipilih
4. **Connect frontend** ke backend API

---

**🎯 Goal: Semua peserta yang mendaftar akan muncul di daftar yang bisa diakses oleh siapa saja dari device apapun!**
