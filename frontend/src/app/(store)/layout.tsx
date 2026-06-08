import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { FrapButton } from '@/components/layout/FrapButton'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[100px]">{children}</main>
      <Footer />
      <CartDrawer />
      <FrapButton />
    </div>
  )
}
