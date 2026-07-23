# Randevu Modülü - Frontend

Bu proje, randevu yönetim sisteminin modern, hızlı ve tür güvenli (type-safe) kullanıcı arayüzüdür. React, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🛠️ Teknoloji Yığını

- **Core:** React 18+ (Vite ile build edildi)
- **Dil:** TypeScript (Strict mode aktif)
- **Styling:** Tailwind CSS
- **Veri Fetching:** TanStack Query v5 (React Query)
- **HTTP İstekleri:** Axios
- **Yönlendirme:** React Router v7
- **Kod Kalitesi:** ESLint + Prettier

## 📦 Kurulum ve Çalıştırma

Projeyi yerel makinenize kurmak ve çalıştırmak için aşağıdaki adımları izleyin:

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın

Uygulama `http://localhost:5173` adresinde ayağa kalkacaktır.

```bash
npm run dev
```

### 3. Üretim (Production) Build'i Oluşturun

Proje dağıtıma hazır hale getirmek için:

```bash
npm run build
```

_(Bu komut TypeScript hatalarını kontrol eder ve `dist/` klasörüne optimize edilmiş dosyaları çıkartır.)_

### 4. Kod Kalitesi Kontrolleri

````bash
# Sadece ESLint kurallarını kontrol eder
npm run lint
---

## ⚙️ Yapılandırma (Environment Variables)

Proje root dizininde `.env` dosyası oluşturarak API adresini özelleştirebilirsiniz:

```env
VITE_API_BASE_URL=http://localhost:8000/api
````

> **Not:** Varsayılan olarak `src/api/index.ts` içinde `http://localhost:8000/api` olarak tanımlıdır. Eğer farklı bir porta veya sunucuya bağlanacaksanız `.env` dosyasını kullanın.

---

## 📁 Proje Mimarisi (Folder Structure)

Projede **Feature-Based (Özellik bazlı)** ve **DRY (Kendini Tekrar Etme)** prensipleri benimsenmiştir.

```text
src/
├── api/                    # Axios instance ve uç nokta (endpoint) tanımları
│   ├── index.ts            # Temel Axios kurulumu (Base URL, Interceptors)
│   ├── auth.ts             # Giriş/Çıkış/Kayıt uç noktaları
│   ├── profiles.ts         # Profil bilgisi uç noktası
│   ├── appointments.ts     # Randevu işlemleri
│   ├── categories.ts       # Kategori CRUD işlemleri
│   ├── services.ts         # Hizmet CRUD işlemleri
│   └── staff.ts            # Personel CRUD işlemleri
│
├── hooks/                  # Tüm React Query (TanStack Query) hook'ları
│   ├── useAuthQueries.ts
│   ├── useProfileQueries.ts
│   ├── useAppointmentQueries.ts
│   ├── useCategoryQueries.ts
│   ├── useServiceQueries.ts
│   └── useStaffQueries.ts
│
├── other/                  # Global Types, Context ve Yardımcılar
│   └── types.ts            # Tüm TypeScript Arayüzleri (Interface/Type)
│
├── context/                # React Context API
│   └── AuthContext.tsx      # Kullanıcı oturum (Auth) state yönetimi
│
├── pages/                  # Sayfa Bileşenleri (Route'lara bağlanan)
│   ├── layouts/            # Ortak Layout bileşenleri (Sidebar, Header vb.)
│   ├── shared/             # Herkesin erişebildiği sayfalar (Login, Register, Profile)
│   ├── admin/              # Sadece Admin rolünün görebileceği sayfalar (14 Sayfa)
│   ├── staff/              # Sadece Personel rolünün görebileceği sayfalar
│   └── customer/           # Müşteri paneli sayfaları
│
├── routes/                 # React Router yapılandırma dosyaları
│   ├── RoleRoutes.tsx      # Rol tabanlı korumalı route wrapper
│   ├── customerRoutes.tsx
│   ├── staffRoutes.tsx
│   └── adminRoutes.tsx
│
├── App.tsx                 # Ana yönlendirici (Router) bileşeni
└── main.tsx                # Uygulamanın giriş noktası (QueryClientProvider burada)
```

---

## 🧠 Temel Tasarım Kararları & Pattern'ler

1.  **Discriminated Unions (TypeScript):**
    Login ve Profil işlemlerinderollerine göre (`customer`, `admin`, `staff`) dönen JSON yapıları farklıdır. Bunları yönetmek için TypeScript'in _Discriminated Union_ özelliği kullanılmıştır. Bu sayede `if (role === 'admin')` yazdığınızda TypeScript otomatik olarak admin verisinin şeklini bilir ve hata yapmanızı engeller.
2.  **Zaman Dilimi (Timezone) Güvenliği:**
    Tarih ve saatler formatlanırken JavaScript'in otomatik saat dilimi dönüşümü (örneğin GMT+3'e çevirmesi) önlenmiştir. `new Date()` yerine string manipülasyonları yapılarak backend'den gelen saat (`15:00:00`) kesin olarak ekrana yansıtılır.
3.  **Optimistic UI & Caching:**
    Veri güncelleme (PUT/PATCH/DELETE) işlemlerinde `queryClient.invalidateQueries()` kullanılarak ilgili liste anında güncellenir, sayfa yenilenmesine gerek kalmaz.
4.  **Route Protection:**
    `RoleRoutes` yardımcı fonksiyonu sayesinde route'lar tek bir satırda korunabilir. Örn: `<Route element={<RoleRoutes allowedRoles={['admin']}><Layout /></RoleRoutes>} />`
5.  **Modüler API Katmanı:**
    Axios istekleri `api/` klasöründe, React Query mantığı ise `hooks/` klasöründe tutulmuştur. Böylece bir API endpoint'inin yeri değiştiğinde sadece bir dosyayı güncellemek yeterlidir.

## 🔗 Backend Entegrasyonu

Bu frontend, Laravel tabanlı bir API ile haberleşmek üzere tasarlanmıştır. Uyumlu çalışması için Backend'in şu yapıda JSON döndürmesi beklenir:

- **Başarılı Auth Yanıtları:** `{ token: "...", role: "customer", customer: { ... } }`
- **Hata Yanıtları:** `{ message: "...", errors: { email: ["E-posta zorunludur"] } }`
- **Sayfalandırma:** Standart Laravel Paginate yapısı beklenmektedir.
