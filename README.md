# Randevu Yönetim Modülü — Frontend

Randevu yönetim modülünün **frontend** tarafıdır. Kullanıcıların randevularını görüntüleyebildiği, filtreleyebildiği, arayabildiği, oluşturabildiği, düzenleyebildiği ve iptal edebildiği, mobil / tablet / masaüstü uyumlu (responsive) tek sayfa uygulamasıdır (SPA).

**React 19 + Vite + TypeScript + Tailwind CSS** ile geliştirilmiştir. Backend olarak [appointment_module_backend](../appointment_module_backend) (Laravel 13 API) ile haberleşir.

## Kullanılan Teknolojiler

- **React 19** — UI kütüphanesi
- **Vite 8** — geliştirme ve build aracı
- **TypeScript** — tip güvenliği
- **Tailwind CSS 4** — utility-first CSS
- **React Router 8** — sayfa yönlendirme
- **TanStack Query 5** — veri çekme ve cache
- **Axios** — HTTP istemcisi
- **ESLint** — kod kalitesi

## Modül Kapsamı (Frontend)

- **Randevu listeleme** — API üzerinden
- **Filtreleme** — randevu **durumu**, **personel** ve **tarih**e göre
- **Arama** — **müşteri adı**na göre
- **Yeni randevu oluşturma** — hizmet, personel, tarih ve saat seçimi
- **Randevu düzenleme** — aynı alanlar güncellenebilir
- **Randevu iptal etme**
- **Müsaitlik kontrolü** — daha önce rezerve edilmiş veya uygun olmayan saatler seçilemez
- **Responsive tasarım** — mobil, tablet ve masaüstü uyumlu
- **Role dayalı yönlendirme** — müşteri, personel, admin

## Gereksinimler

- Node.js **18+** (Node **20+** önerilir)
- npm
- Çalışan bir [backend API](../appointment_module_backend)

## Kurulum

```bash
npm install
cp .env.example .env   # (opsiyonel) API adresini değiştirmek için
```

## Yapılandırma

API taban URL'si [`src/api/index.ts`](src/api/index.ts) içinde tanımlıdır ve ortam değişkeni ile geçersiz kılınabilir:

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
});
```

`.env` dosyası:

```bash
# Boş bırakırsanız http://localhost:8000/api kullanılır
VITE_API_BASE_URL=
```

Kimlik doğrulama bilgileri `localStorage` üzerinde şu anahtarlarla tutulur:

| Anahtar   | Açıklama                  |
| --------- | ------------------------- |
| `token`   | API Bearer token          |
| `role`    | Kullanıcı rolü            |

401 yanıtı alındığında token otomatik temizlenir ve kullanıcı `/login` sayfasına yönlendirilir.

## Çalıştırma

```bash
# Geliştirme sunucusu (hot reload)
npm run dev

# Üretim build'i (type-check + bundle)
npm run build

# Üretim build'ini önizle
npm run preview

# Lint
npm run lint
```

Varsayılan geliştirme adresi: <http://localhost:5173>

## Test Hesapları

Backend seed edildikten sonra aşağıdaki hesaplarla giriş yapılabilir:

| Rol | E-posta | Şifre |
| --- | --- | --- |
| Admin | `admin@test.com` | `admin123` |
| Personel | `selin@test.com`, `murat@test.com`, `ahmet@test.com`, `burcu@test.com`, `huseyin@test.com`, `sevgi@test.com` | `staff123` |
| Müşteri | `ahmad@test.com`, `elif@test.com`, `burak@test.com` | `customer123` |

## Proje Yapısı

```
src/
├── api/                        # Axios instance ve uç nokta fonksiyonları
│   ├── index.ts                #   - baseURL + auth interceptor + 401 handler
│   ├── auth.ts                 #   - login / logout / register
│   ├── appointments.ts         #   - randevu CRUD + filtreler
│   ├── categories.ts
│   ├── services.ts
│   ├── staff.ts
│   └── profiles.ts
├── contexts/
│   └── auth/                   # AuthContext, AuthProvider, useAuth
├── hooks/                      # TanStack Query sarmalayıcıları + yardımcı hook'lar
│   ├── useAppointmentQueries.ts
│   ├── useAuthQueries.ts
│   ├── useCategoryQueries.ts
│   ├── useProfileQueries.ts
│   ├── useServiceQueries.ts
│   ├── useStaffQueries.ts
│   └── useDarkMode.ts
├── pages/
│   ├── admin/                  # Admin sayfaları (sidebar'lı)
│   │   ├── AdminHomePage.tsx
│   │   ├── AdminAppointmentsList.tsx       # Durum/personel/tarih filtresi + arama
│   │   ├── AdminAppointmentDetail.tsx
│   │   ├── AdminProfilePage.tsx
│   │   ├── categories/                      # Kategori CRUD
│   │   ├── services/                       # Hizmet CRUD
│   │   ├── staff/                          # Personel CRUD
│   │   └── components/AdminSidebar.tsx
│   ├── customer/               # Müşteri sayfaları (sidebar'lı)
│   │   ├── ServicesPage.tsx                # Hizmet listesi
│   │   ├── ServiceDetailPage.tsx           # Hizmet detayı + randevu oluşturma
│   │   ├── MyAppointmentsPage.tsx          # Randevularım + durum/tarih filtresi
│   │   ├── MyAppointmentDetailPage.tsx     # Randevu detayı + iptal
│   │   └── components/CustomerSidebar.tsx
│   ├── staff/                  # Personel sayfaları (sidebar'lı)
│   │   ├── StaffAppointmentsPage.tsx       # Tarih/müşteri/durum filtresi
│   │   ├── StaffAppointmentDetailPage.tsx
│   │   └── components/StaffSidebar.tsx
│   ├── shared/                 # Login, Register, Profil, 404, 401
│   ├── components/             # Header, Footer, Loading, Error, ThemeToggle
│   └── layouts/                # GeneralLayout, AdminLayout, CustomerLayout, StaffLayout
├── routes/
│   ├── adminRoutes.tsx
│   ├── customerRoutes.tsx
│   ├── staffRoutes.tsx
│   └── RoleRoutes.tsx          # Role-based korumalı route yapısı
├── other/                      # ProtectedRoute, tipler, yardımcılar
├── App.tsx                     # Routes
├── main.tsx                    # QueryClient + BrowserRouter + AuthProvider
└── index.css
```

## Scripts

| Script           | Açıklama                                |
| ---------------- | --------------------------------------- |
| `npm run dev`    | Vite geliştirme sunucusunu başlatır     |
| `npm run build`  | Type-check (`tsc -b`) + üretim build    |
| `npm run preview`| Üretim build'ini önizler                |
| `npm run lint`   | ESLint çalıştırır                       |

## Filtreler Özeti

| Sayfa | Filtreler |
| --- | --- |
| Admin → Randevular | durum, personel, tarih + müşteri adı arama |
| Personel → Randevularım | tarih, müşteri adı, durum |
| Müşteri → Randevularım | durum, tarih |

## Responsive Tasarım

Uygulama aşağıdaki kırılma noktalarına göre tasarlanmıştır (Tailwind utility sınıfları ile):

- **Mobil** — varsayılan (< 640px) → sidebar drawer + hamburger menü
- **Tablet** — `sm:` / `md:` (≥ 640px / ≥ 768px)
- **Masaüstü** — `lg:` / `xl:` (≥ 1024px / ≥ 1280px) → sabit sidebar (256px)

## Lisans

MIT
