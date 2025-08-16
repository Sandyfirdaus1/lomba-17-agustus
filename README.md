# 🏆 Website Lomba 17 Agustus

Website resmi untuk pendaftaran dan pengelolaan lomba 17 Agustus RT/RW. Dibangun dengan teknologi modern untuk memberikan pengalaman yang optimal bagi peserta dan admin.

## 🚀 Fitur Utama

### 👥 **Untuk Peserta:**

- 📝 **Pendaftaran Online**: Form pendaftaran yang mudah digunakan
- 🎯 **Pemilihan Lomba Otomatis**: Lomba disesuaikan berdasarkan usia peserta
- 📊 **Daftar Peserta Publik**: Melihat daftar semua peserta yang telah mendaftar
- 🔍 **Pencarian Peserta**: Fitur pencarian berdasarkan nama
- 📈 **Statistik Peserta**: Visualisasi data peserta berdasarkan kategori usia

### 👨‍💼 **Untuk Admin:**

- 🔐 **Login Admin**: Akses terproteksi dengan password
- ✏️ **Kelola Kategori Usia**: Tambah, edit, hapus kategori usia
- 🏅 **Kelola Daftar Lomba**: Tambah, edit, hapus lomba
- 🗑️ **Hapus Peserta**: Fitur hapus peserta dengan konfirmasi
- 📥 **Export CSV**: Export data peserta ke format CSV
- ⚡ **Real-time Updates**: Perubahan langsung terlihat di semua halaman

## 🛠️ Teknologi yang Digunakan

### **Frontend Framework:**

- **Next.js 15.4.6** - React framework dengan App Router
- **React 18** - Library UI modern
- **TypeScript** - Type safety dan developer experience yang lebih baik

### **Styling & UI:**

- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library yang modern
- **Framer Motion** - Animasi dan transisi yang smooth

### **State Management:**

- **useState & useEffect** - React hooks untuk state management
- **localStorage** - Penyimpanan data lokal di browser
- **Custom Events** - Komunikasi antar komponen

### **Development Tools:**

- **ESLint** - Code linting dan quality control
- **TypeScript** - Static type checking
- **Next.js Build System** - Optimized production build

## 📁 Struktur Project

```
lomba-17-agustus/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout dengan Navbar & Footer
│   │   ├── page.tsx           # Halaman beranda
│   │   ├── daftar/            # Halaman pendaftaran
│   │   ├── peserta/           # Halaman daftar peserta
│   │   └── admin/             # Halaman admin panel
│   ├── components/            # Reusable components
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Footer.tsx         # Footer component
│   │   ├── Hero.tsx           # Hero section
│   │   ├── CategoryGrid.tsx   # Grid kategori lomba
│   │   └── AdminToggle.tsx    # Toggle admin mode
│   ├── lib/                   # Utility functions
│   │   └── competitions.ts    # Data management & logic
│   └── app/globals.css        # Global styles
├── public/                    # Static assets
├── package.json              # Dependencies & scripts
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation
```

## 🚀 Cara Menjalankan

### **Prerequisites:**

- Node.js 18+
- npm atau yarn

### **Installation:**

```bash
# Clone repository
git clone <repository-url>
cd lomba-17-agustus

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **Development:**

```bash
# Development server dengan hot reload
npm run dev

# Build project
npm run build

# Lint code
npm run lint
```

## 🎯 Cara Penggunaan

### **Untuk Peserta:**

1. **Buka Website**: Akses `http://localhost:3000`
2. **Lihat Kategori**: Scroll ke bagian "Kategori Usia & Lomba"
3. **Daftar**: Klik "Pendaftaran" di navbar
4. **Isi Form**: Masukkan data diri dan pilih lomba
5. **Submit**: Klik "Daftar Sekarang"
6. **Lihat Daftar**: Cek halaman "Daftar Peserta"

### **Untuk Admin:**

1. **Login Admin**: Klik tombol "Admin" di navbar
2. **Masukkan Password**: Hubungi admin untuk mendapatkan password
3. **Akses Panel**: Klik link "Admin" di navbar
4. **Kelola Data**:
   - Tambah/edit/hapus kategori usia
   - Tambah/edit/hapus daftar lomba
5. **Kelola Peserta**:
   - Hapus peserta dari halaman "Daftar Peserta"
   - Export data ke CSV

## 📊 Data Structure

### **Kategori Usia:**

```typescript
interface AgeGroup {
  label: string; // Contoh: "Anak-anak"
  min: number; // Usia minimum
  max: number; // Usia maksimum
}
```

### **Lomba:**

```typescript
interface Competition {
  id: string; // Unique ID
  name: string; // Nama lomba
  description?: string; // Deskripsi (opsional)
  minAge: number; // Usia minimum
  maxAge: number; // Usia maksimum
  team?: boolean; // Apakah lomba tim
}
```

### **Peserta:**

```typescript
interface Participant {
  id: string; // Unique ID
  name: string; // Nama lengkap
  age: number; // Usia
  phone?: string; // Nomor HP (opsional)
  competitions: string[]; // Array ID lomba yang dipilih
  createdAt: number; // Timestamp pendaftaran
}
```

## 🔧 Konfigurasi

### **Password Admin:**

- Password admin bersifat rahasia dan tidak ditampilkan di dokumentasi
- Dapat diubah di file `src/components/AdminToggle.tsx`
- Hubungi developer untuk informasi password

### **Data Storage:**

- Data disimpan di `localStorage` browser
- Keys: `lomba17_participants`, `lomba17_competitions`, `lomba17_ageGroups`
- Data persisten selama browser tidak di-clear

### **Styling:**

- Menggunakan Tailwind CSS
- Dark mode support
- Responsive design untuk mobile dan desktop

## 🎨 UI/UX Features

### **Design System:**

- **Color Scheme**: Merah-putih (tema 17 Agustus)
- **Typography**: Geist Sans & Geist Mono fonts
- **Icons**: Lucide React icons
- **Animations**: Framer Motion untuk transisi

### **Responsive Design:**

- **Mobile First**: Optimized untuk mobile devices
- **Tablet**: Layout yang responsif untuk tablet
- **Desktop**: Full layout untuk desktop

### **Accessibility:**

- **Keyboard Navigation**: Support navigasi keyboard
- **Screen Reader**: Compatible dengan screen reader
- **Focus Management**: Proper focus indicators

## 🔒 Security Features

### **Admin Protection:**

- Password-protected admin access (password tidak ditampilkan di dokumentasi)
- Session management dengan localStorage
- Confirmation dialogs untuk aksi destruktif
- Password dapat diubah di file `src/components/AdminToggle.tsx`

### **Security Best Practices:**

- Password admin bersifat rahasia dan tidak di-commit ke repository
- Gunakan password yang kuat dan unik
- Jangan bagikan password admin kepada orang yang tidak berwenang
- Ubah password secara berkala untuk keamanan

### **Data Validation:**

- Form validation untuk input user
- Type checking dengan TypeScript
- Sanitization input data

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Developer**: [Your Name]
**Email**: [your.email@example.com]
**GitHub**: [@yourusername]

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **Framer Motion** - Smooth animations

## 🔐 **Keamanan & Privasi**

### **Password Admin:**

- Password admin bersifat rahasia dan tidak ditampilkan di dokumentasi publik
- Untuk mendapatkan password admin, hubungi developer atau administrator
- Password dapat diubah di file `src/components/AdminToggle.tsx`

### **Data Privacy:**

- Data peserta disimpan secara lokal di browser (localStorage)
- Tidak ada data yang dikirim ke server eksternal
- Data hanya dapat diakses dari perangkat yang sama

### **Security Recommendations:**

- Gunakan password yang kuat untuk akses admin
- Jangan bagikan password admin kepada orang yang tidak berwenang
- Ubah password secara berkala
- Backup data secara regular jika diperlukan

---

**🎉 Selamat menggunakan Website Lomba 17 Agustus!**

_Website ini dibuat dengan ❤️ untuk memudahkan pengelolaan lomba 17 Agustus RT/RW._

**⚠️ Penting**: Password admin bersifat rahasia dan tidak ditampilkan di dokumentasi ini untuk keamanan.
