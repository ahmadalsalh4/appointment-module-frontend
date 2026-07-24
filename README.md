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
```

## Yapılandırma

API taban URL'si [`src/api/index.ts`](src/api/index.ts) içinde tanımlıdır:

```ts
const api = axios.create({ baseURL: "http://appointment_module_backend.test/api" });
```

Laravel Valet / Herd gibi `*.test` alan adı kullanmıyorsanız bu adresi kendi local adresinizle değiştirin (ör. `http://localhost:8000/api`).

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

# Üretim build'i
npm run build

# Üretim build'ini önizle
npm run preview

# Lint
npm run lint
```

Varsayılan geliştirme adresi: <http://localhost:5173>

## Proje Yapısı

```
src/
├── api/                    # Axios instance ve uç nokta fonksiyonları
│   ├── index.ts            #   - Axios ayarı, interceptor'lar
│   ├── auth.ts             #   - login / register
│   ├── appointments.ts     #   - randevu CRUD
│   ├── categories.ts
│   ├── services.ts
│   ├── staff.ts
│   └── profiles.ts
├── contexts/
│   └── auth/               # AuthContext, AuthProvider, useAuth
├── hooks/                  # Ortak hook'lar
├── pages/
│   ├── admin/              # Admin sayfaları
│   │   ├── categories/
│   │   ├── services/
│   │   ├── staff/
│   │   ├── components/
│   │   ├── AdminHomePage.tsx
│   │   ├── AdminAppointmentsList.tsx
│   │   ├── AdminAppointmentDetail.tsx
│   │   └── AdminProfilePage.tsx
│   ├── customer/           # Müşteri sayfaları
│   │   ├── components/
│   │   ├── ServicesPage.tsx
│   │   ├── ServiceDetailPage.tsx
│   │   ├── MyAppointmentsPage.tsx
│   │   └── MyAppointmentDetailPage.tsx
│   ├── staff/              # Personel sayfaları
│   │   ├── components/
│   │   ├── StaffAppointmentsPage.tsx
│   │   └── StaffAppointmentDetailPage.tsx
│   ├── shared/             # Login gibi ortak sayfalar
│   ├── components/
│   └── layouts/
├── routes/
│   ├── adminRoutes.tsx
│   ├── customerRoutes.tsx
│   ├── staffRoutes.tsx
│   └── RoleRoutes.tsx      # Role göre korumalı route yapısı
├── other/                  # ProtectedRoute, tipler, yardımcılar
├── App.tsx
├── main.tsx
└── index.css
```

## Scripts

| Script           | Açıklama                                |
| ---------------- | --------------------------------------- |
| `npm run dev`    | Vite geliştirme sunucusunu başlatır     |
| `npm run build`  | Type-check (`tsc -b`) + üretim build    |
| `npm run preview`| Üretim build'ini önizler                |
| `npm run lint`   | ESLint çalıştırır                       |

## Responsive Tasarım

Uygulama aşağıdaki kırılma noktalarına göre tasarlanmıştır (Tailwind utility sınıfları ile):

- **Mobil** — varsayılan (< 640px)
- **Tablet** — `sm:` / `md:` (≥ 640px / ≥ 768px)
- **Masaüstü** — `lg:` / `xl:` (≥ 1024px / ≥ 1280px)

## Lisans

MIT
