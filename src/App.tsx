import React from "react";

const App = () => {
  // Dummy (Sahte) Veriler - Buraya kendi API verilerinizi bağlayacaksınız
  const stats = [
    { title: "Toplam Randevu", value: "124", icon: "📅", color: "bg-main" },
    { title: "Bekleyen", value: "8", icon: "⏳", color: "bg-waiting" },
    { title: "Tamamlanan", value: "110", icon: "✅", color: "bg-completed" },
    { title: "İptal Edilen", value: "6", icon: "❌", color: "bg-canceld" },
  ];

  const upcomingAppointments = [
    { id: 1, service: "Saç Kesimi", staff: "Ahmet Y.", customer: "Ayşe K.", date: "15 Eki 2023", time: "10:30", status: "Bekliyor" },
    { id: 2, service: "Masaj", staff: "Fatma B.", customer: "John D.", date: "15 Eki 2023", time: "11:15", status: "Onaylandı" },
    { id: 3, service: "Diş Kontrolü", staff: "Dr. Mehmet", customer: "Jane M.", date: "15 Eki 2023", time: "14:00", status: "Bekliyor" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Bekliyor": return "bg-waiting/10 text-waiting";
      case "Onaylandı": return "bg-deep/10 text-deep";
      case "Tamamlandı": return "bg-completed/10 text-completed";
      case "İptal": return "bg-canceld/10 text-canceld";
      default: return "bg-main/10 text-main";
    }
  };

  return (
    // Ana arka plan
    <div className="min-h-screen p-4 sm:p-8 bg-back">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Sayfa Başlığı */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-main">
            Kontrol Paneli
          </h1>
          <p className="mt-1 text-sm text-main/70">
            15 Ekim 2023, Pazar - Hoş geldiniz!
          </p>
        </div>

        {/* Özet Kartları (Stats Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface p-5 rounded-2xl shadow-sm border border-main/5">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md text-white ${stat.color}`}>
                  {stat.title}
                </span>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-main">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Hızlı Aksiyonlar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-deep hover:opacity-90 transition-all">
            <span>+</span> Yeni Randevu
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-main bg-surface border border-main/20 hover:bg-back transition-all">
            Randevularım
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-main bg-surface border border-main/20 hover:bg-back transition-all">
            Personel Yönetimi
          </button>
        </div>

        {/* Yaklaşan Randevular Tablosu */}
        <div className="bg-surface rounded-2xl shadow-sm border border-main/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-main/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-main">Yaklaşan Randevular</h2>
            <button className="text-sm font-medium text-deep hover:underline">
              Tümünü Gör
            </button>
          </div>
          
          {/* Tablo Başlığı (Masaüstü) */}
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-back text-xs font-medium text-main/60 uppercase tracking-wider">
            <div>Hizmet</div>
            <div>Personel</div>
            <div>Müşteri</div>
            <div>Tarih / Saat</div>
            <div>Durum</div>
          </div>

          {/* Tablo İçeriği */}
          <div className="divide-y divide-main/5">
            {upcomingAppointments.map((appt) => (
              <div key={appt.id} className="md:grid md:grid-cols-5 md:gap-4 px-6 py-4 flex flex-col gap-2 hover:bg-back/50 transition-colors">
                
                <div className="font-medium text-main">{appt.service}</div>
                
                <div className="text-sm text-main/80">{appt.staff}</div>
                
                <div className="text-sm text-main/80">{appt.customer}</div>
                
                <div className="text-sm text-main/80">
                  {appt.date} - <span className="font-medium">{appt.time}</span>
                </div>
                
                <div className="flex items-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* Alt Bilgi */}
        <p className="mt-8 text-center text-xs text-completed/80">
          © 2023 Şirket Adı. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
};

export default App;