import Hero      from './sections/Hero/Hero'
import About     from './sections/About/About'
import Brand     from './sections/Brand/Brand'
import Services  from './sections/Services/Services'
import Portfolio from './sections/Portfolio/Portfolio'
import Talent    from './sections/Talent/Talent'
import Contact   from './sections/Contact/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Brand />
      <Services />
      <Portfolio />
      <Talent />
      <Contact />
    </>
  )
}
