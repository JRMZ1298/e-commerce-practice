import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FrapButton } from "@/components/layout/FrapButton";

export const metadata: Metadata = {
  title: "MAISON - Ropa y Accesorios",
  description:
    "Descubre nuestra colección exclusiva de ropa y accesorios con estilo y elegancia",
  openGraph: {
    title: "MAISON - Ropa y Accesorios",
    description:
      "Descubre nuestra colección exclusiva de ropa y accesorios con estilo y elegancia",
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[100px] bg-cards">{children}</main>
      <Footer />
      <CartDrawer />
      <FrapButton />
    </div>
  );
}
