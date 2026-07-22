import { Outlet } from "react-router";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GlobalLayout() {
  return (
    <div className="flex flex-col min-h-screen  bg-back">
      <Header></Header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
}
