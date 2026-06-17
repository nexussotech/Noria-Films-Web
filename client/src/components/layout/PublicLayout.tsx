import { type ReactNode } from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'

interface Props {
  children: ReactNode
}

export default function PublicLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-h)' }}>{children}</main>
      <Footer />
    </>
  )
}
