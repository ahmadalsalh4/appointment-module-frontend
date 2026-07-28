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
- **Dark / Light tema** — sidebar'dan değiştirilebilir, `localStorage`'da saklanır

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
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://appointment_module_backend.test/api";
```

`.env` dosyası:

```bash
# Varsayılan: http://appointment_module_backend.test/api (Laravel Herd / Valet)
# Boş bırakırsanız fallback kullanılır
VITE_API_BASE_URL=http://appointment_module_backend.test/api
```

> **Not:** Vite env değişkenleri `VITE_` prefix'i ile başlamalı ve build sırasında JS'e gömülür. Boş string olarak ayarlanmamalı (fallback boş string için tetiklenmez).

Kimlik doğrulama bilgileri `localStorage` üzerinde şu anahtarlarla tutulur:

| Anahtar   | Açıklama                  |
| --------- | ------------------------- |
| `token`   | API Bearer token          |
| `role`    | Kullanıcı rolü            |
| `theme`   | `"light"` veya `"dark"`   |

401 yanıtı alındığında token otomatik temizlenir ve kullanıcı `/login` sayfasına yönlendirilir. Tema `index.html`'deki inline script ile sayfa yüklenmeden önce uygulanır (FOUC engelleme).

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

| Rol | E-posta | Şifre | Kategori |
| --- | --- | --- | --- |
| Admin | `admin@test.com` | `admin123` | — |
| Personel | `selin@test.com`, `murat@test.com` | `staff123` | Eğitim |
| Personel | `ahmet@test.com`, `burcu@test.com` | `staff123` | Yazılım |
| Personel | `huseyin@test.com`, `sevgi@test.com` | `staff123` | Temizlik |
| Müşteri | `ahmad@test.com`, `elif@test.com`, `burak@test.com` | `customer123` | — |
| **Çoklu rol** | `multi@test.com` | `multi123` | Hem müşteri hem personel (sidebar'daki rol değiştiriciyi test etmek için) |

## Layout Mimarisi

İki ayrı layout ailesi vardır:

| Layout | Nerede | İçerik |
| --- | --- | --- |
| **`PublicLayout`** | `/login`, `/register`, `/unauthorized`, 404 | Header + içerik + Footer |
| **`CustomerLayout`** | Müşteri rotaları (`/`, `/appointments`, `/services`, …) | Sidebar (logo, menü, tema toggle, çıkış) + içerik |
| **`StaffLayout`** | Personel rotaları (`/staff`, `/staff/appointments`, …) | Sidebar + içerik |
| **`AdminLayout`** | Admin rotaları (`/admin`, …) | Sidebar + içerik |

Dashboard sayfalarında public Header/Footer **görünmez**; sadece role özel sidebar + içerik vardır.

### Sidebar Yapısı (her rol için aynı)

```
[Logo / Başlık]
─────────────
📅 Menü öğesi 1
📅 Menü öğesi 2
📅 Menü öğesi 3
─────────────
TEMA    [🌙/☀️]
🚪 Çıkış Yap
```

- **Mobil** (< 1024px): Hamburger buton → slide-out drawer
- **Masaüstü** (≥ 1024px): Sabit sidebar (256px genişlik)

## Proje Yapısı

```
src/
├── api/                        # Axios instance ve uç nokta fonksiyonları
│   ├── index.ts                #   - baseURL + auth + 401 interceptor
│   ├── auth.ts
│   ├── appointments.ts
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
│   │   ├── AdminAppointmentsList.tsx       # Filtre: durum/personel/tarih + müşteri arama
│   │   ├── AdminAppointmentDetail.tsx
│   │   ├── AdminProfilePage.tsx
│   │   ├── categories/                      # Kategori CRUD
│   │   ├── services/                       # Hizmet CRUD
│   │   ├── staff/                          # Personel CRUD
│   │   └── components/AdminSidebar.tsx
│   ├── customer/               # Müşteri sayfaları (sidebar'lı)
│   │   ├── ServicesPage.tsx                # Hizmet listesi
│   │   ├── ServiceDetailPage.tsx           # Hizmet detayı + randevu oluşturma
│   │   ├── MyAppointmentsPage.tsx          # Filtre: durum/personel/tarih
│   │   ├── MyAppointmentDetailPage.tsx     # Randevu detayı + iptal
│   │   └── components/CustomerSidebar.tsx
│   ├── staff/                  # Personel sayfaları (sidebar'lı)
│   │   ├── StaffAppointmentsPage.tsx       # Filtre: müşteri/durum/tarih
│   │   ├── StaffAppointmentDetailPage.tsx
│   │   └── components/StaffSidebar.tsx
│   ├── shared/                 # Login, Register, Profil, 404, 401
│   ├── components/             # Header, Footer, Loading, Error, ThemeToggle
│   └── layouts/                # PublicLayout, AdminLayout, CustomerLayout, StaffLayout
├── routes/
│   ├── adminRoutes.tsx
│   ├── customerRoutes.tsx
│   ├── staffRoutes.tsx
│   └── RoleRoutes.tsx          # Role-based korumalı route yapısı
├── other/                      # ProtectedRoute, tipler, yardımcılar
├── App.tsx                     # Routes (public + role-based ayrı gruplar)
├── main.tsx                    # QueryClient + BrowserRouter + AuthProvider
├── vite-env.d.ts               # Vite client types + VITE_API_BASE_URL
└── index.css                   # Tailwind + tema değişkenleri (CSS variables)
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
| Müşteri → Randevularım | durum, personel, tarih (personel listesi müşterinin kendi randevu geçmişinden türetilir) |

Tüm filtreler reaktiftir (her değişiklikte otomatik fetch) ve "Filtreleri Temizle" butonu ile sıfırlanabilir.

## Dark / Light Tema

- **CSS variables** (`index.css`) ile tanımlı: `--color-main`, `--color-back`, `--color-surface`, `--color-deep`, `--color-waiting`, `--color-completed`, `--color-canceld`
- `.dark` sınıfı root'a eklendiğinde değişkenler otomatik değişir
- Tema seçimi `localStorage.theme`'da saklanır
- Sayfa yüklenmeden önce inline script ile doğru tema uygulanır (flash yok)
- Sidebar altındaki buton ile değiştirilebilir

## Responsive Tasarım

Uygulama aşağıdaki kırılma noktalarına göre tasarlanmıştır (Tailwind utility sınıfları ile):

- **Mobil** — varsayılan (< 640px) → sidebar drawer + hamburger menü
- **Tablet** — `sm:` / `md:` (≥ 640px / ≥ 768px)
- **Masaüstü** — `lg:` / `xl:` (≥ 1024px / ≥ 1280px) → sabit sidebar (256px)

## Lisans

MIT
