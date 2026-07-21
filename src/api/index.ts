import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api" });

// 1. İstek atılmadan hemen önce çalışır (REQUEST INTERCEPTOR)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 2. CEVAP GELDİKTEN SONRA çalışır (RESPONSE INTERCEPTOR) - BUNU EKLE
api.interceptors.response.use(
  (response) => {
    // Eğer cevap başarılıysa (2xx), hiçbir şey yapma, veriyi olduğu gibi geri döndür
    return response;
  },
  (error) => {
    // Eğer cevap hatalıysa (4xx, 5xx) buraya düşer
    if (error.response?.status === 401) {
      console.error("Token geçersiz veya süresi dolmuş. Çıkış yapılıyor...");

      // 1. LocalStorage'daki eski/bozuk verileri temizle
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // 2. Kullanıcıyı zorla login sayfasına yönlendir
      // window.location.href ile sayfayı tamamen yeniler (React state'ini sıfırlar)
      window.location.href = "/login";
    }

    // Diğer hataları (500, 404 vs.) bileşenlere (component) gönder ki orada Error bileşeniyle gösterebilelim
    return Promise.reject(error);
  },
);

export default api;
