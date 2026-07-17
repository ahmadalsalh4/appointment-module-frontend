import { Route, Routes, useNavigate } from "react-router";

import { useAuth } from "./auth/useAuth";
import ProtectedRoute from "./auth/ProtectedRoute";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: "user" | "admin") => {
    login(role);

    if (role === "admin") navigate("/admin");
    else navigate("/panel");
  };

  return (
    <div>
      <h2>Giriş Yap</h2>
      <button onClick={() => handleLogin("user")}>User olarak Gir</button>
      <button onClick={() => handleLogin("admin")}>Admin olarak Gir</button>
    </div>
  );
};

const UserPanel = () => <h2>Kullanıcı Paneli (User ve Admin görebilir)</h2>;

const AdminPanel = () => {
  const { logout } = useAuth();
  return (
    <div>
      <h2>Admin Paneli (Sadece Admin)</h2>

      <br />
      <br />
      <button onClick={logout}>Çıkış Yap</button>
    </div>
  );
};

const Unauthorized = () => <h2>403 - Bu sayfaya erişim yetkiniz yok!</h2>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/yetkisiz" element={<Unauthorized />} />

      <Route
        path="/panel"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
