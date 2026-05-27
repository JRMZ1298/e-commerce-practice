import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { FrapButton } from '@/components/layout/FrapButton'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-[64px] sm:pt-[72px] lg:pt-[83px]">{children}</main>
      <Footer />
      <CartDrawer />
      <FrapButton />
    </>
  )
}
