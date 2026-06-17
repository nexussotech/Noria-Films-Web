import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = itemsRef.current?.querySelectorAll<HTMLElement>(`.${styles.animItem}`)
    items?.forEach((el, i) => {
      setTimeout(() => el.classList.add(styles.visible), 200 + i * 280)
    })
  }, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.bg}>
        <img
          src="/assets/images/noria/hero-bg.jpg"
          alt=""
          loading="eager"
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.watermark}>
        <img src="/assets/images/logo-icon-b.png" alt="" />
      </div>

      <div className={styles.content} ref={itemsRef}>
        <div className={styles.animItem}>
          <img src="/assets/images/logo-letras-b.png" alt="NORIA Films" className={styles.logoImg} />
        </div>
        <p className={`${styles.sub} ${styles.animItem}`}>Productora Audiovisual</p>
        <p className={`${styles.desc} ${styles.animItem}`}>
          Transformamos ideas en experiencias cinematográficas inolvidables
        </p>
        <button className={`${styles.cta} ${styles.animItem}`} onClick={() => scrollTo('contacto')}>
          Trabajemos Juntos
        </button>
      </div>

      <button
        className={styles.scrollBtn}
        onClick={() => scrollTo('nosotros')}
        aria-label="Ir a Nosotros"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  )
}
