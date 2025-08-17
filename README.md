# 🎯 Frontend - Lomba 17 Agustus

Frontend aplikasi pendaftaran lomba 17 Agustus dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

## ✨ Fitur Utama

### 🎉 **Pendaftaran Peserta**

- Form pendaftaran yang user-friendly
- Validasi data real-time
- Filter lomba berdasarkan usia
- **Fitur Baru: Dukungan Nama Duplikat dengan Usia Berbeda**

### 🔍 **Sistem Nama Duplikat yang Cerdas**

Sistem ini mendukung peserta dengan nama yang sama secara fleksibel:

#### ✅ **Yang Diizinkan:**

- **Nama sama + Usia berbeda** → Bisa mendaftar
- **Nama sama + Usia sama + Lomba berbeda** → Bisa mendaftar

#### ❌ **Yang Ditolak:**

- **Nama sama + Usia sama + Lomba sama** → Tidak bisa mendaftar

#### 💡 **Contoh Skenario:**

1. **Budi Santoso (12 tahun)** mendaftar lomba "Balap Karung" → ✅ **Berhasil**
2. **Budi Santoso (15 tahun)** mendaftar lomba "Balap Karung" → ✅ **Berhasil**
3. **Budi Santoso (12 tahun)** mendaftar lomba "Makan Kerupuk" → ✅ **Berhasil**
4. **Budi Santoso (12 tahun)** mendaftar lomba "Balap Karung" lagi → ❌ **Ditolak**

### 🎮 **Manajemen Lomba**

- Dashboard admin untuk kelola peserta
- Tracking progress turnamen
- Sistem juara dan ranking
- Status peserta real-time

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Production Build

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build

# Test build
npm start
```

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_NAME="Lomba 17 Agustus"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Build Configuration

- **Next.js 15.4.6** dengan App Router
- **TypeScript** strict mode
- **ESLint** dengan rules ketat
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animasi

## 📁 Struktur Proyek

```
src/
├── app/                    # App Router pages
│   ├── admin/             # Admin dashboard
│   ├── daftar/            # Registration form
│   ├── peserta/           # Participant list
│   └── turnamen/          # Tournament management
├── components/             # Reusable components
│   ├── ui/                # UI components
│   └── ...                # Feature components
└── lib/                    # Utilities & configs
    ├── competitions.ts     # Competition data
    └── utils.ts           # Helper functions
```

## 🎨 UI Components

### Core Components

- **Navbar** - Navigation dengan admin toggle
- **Hero** - Landing page hero section
- **CategoryGrid** - Grid lomba berdasarkan usia
- **AdminToggle** - Toggle admin mode
- **BackendStatus** - Status koneksi backend

### Form Components

- **Registration Form** - Form pendaftaran dengan validasi
- **Competition Selector** - Pilih lomba berdasarkan usia
- **Duplicate Name Handler** - Validasi nama duplikat cerdas

## 🔒 Security Features

### Input Validation

- ✅ Validasi nama (min 2 karakter)
- ✅ Validasi usia (5-100 tahun)
- ✅ Validasi nomor HP (format Indonesia)
- ✅ Validasi nama duplikat dengan usia

### Security Headers

- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Features

- ✅ Mobile-first design
- ✅ Touch-friendly interfaces
- ✅ Optimized for all screen sizes
- ✅ Progressive enhancement

## 🧪 Testing

### Build Testing

```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Build test
npm run build
```

### Manual Testing

- [ ] Form validation
- [ ] Duplicate name handling
- [ ] Age-based filtering
- [ ] Responsive design
- [ ] Admin functionality

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Auto-deploy
git push origin main

# Manual deploy
vercel --prod
```

### Other Platforms

- **Netlify** - Static hosting
- **Railway** - Full-stack deployment
- **Docker** - Container deployment

## 📊 Performance

### Build Metrics

- **Bundle Size**: ~140KB (First Load JS)
- **Build Time**: ~30s
- **Lighthouse Score**: >90
- **Core Web Vitals**: Optimized

### Optimization Features

- ✅ Tree shaking
- ✅ Code splitting
- ✅ Image optimization
- ✅ Bundle analysis

## 🔍 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build

# Fix dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Check types
npm run type-check

# Fix linting
npm run lint --fix
```

#### Runtime Errors

- Check browser console
- Verify environment variables
- Test backend connectivity
- Review network requests

## 📚 Documentation

### Guides

- [🚀 Deployment Guide](./DEPLOYMENT_VERCEL.md)
- [✅ Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [🔧 Backend Integration](./../backend/README.md)

### API Reference

- **Backend API**: `../backend/routes/`
- **Database Schema**: `../backend/models/`
- **Environment Setup**: `../backend/env.example`

## 🤝 Contributing

### Code Style

- **TypeScript** strict mode
- **ESLint** rules compliance
- **Prettier** formatting
- **Conventional commits**

### Development Flow

1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request
5. Code review
6. Merge to main

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

### Getting Help

1. Check [troubleshooting section](#-troubleshooting)
2. Review [deployment guides](./DEPLOYMENT_VERCEL.md)
3. Check [backend documentation](./../backend/README.md)
4. Open issue on GitHub

### Contact

- **Project**: Lomba 17 Agustus
- **Repository**: GitHub
- **Issues**: GitHub Issues

---

**Status**: 🟢 **Ready for Production** | **Version**: 1.0.0 | **Last Updated**: 2024
