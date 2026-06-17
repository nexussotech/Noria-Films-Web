import { useState } from 'react'
import { useReveal } from '../../../../hooks/useReveal'
import styles from './Brand.module.css'

const BRAND_CARDS = [
  { img: '/assets/images/logo-icon-b.png', title: 'El Isotipo', desc: 'La noria representa el ciclo infinito de la creatividad', spinning: true },
  { img: '/assets/images/logo-letras-b.png', title: 'El Logotipo', desc: 'Elegancia tipográfica que refleja profesionalismo', spinning: false },
  { img: '/assets/images/logo-full-b.png', title: 'La Marca Completa', desc: 'La unión perfecta de símbolo e identidad', spinning: false },
]

export default function Brand() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const ref = useReveal()

  return (
    <section className={styles.brand} ref={ref as React.RefObject<HTMLElement>}>
      <div className={styles.decor}>
        <img src="/assets/images/logo-icon-b.png" alt="" />
        <img src="/assets/images/logo-icon-b.png" alt="" />
        <img src="/assets/images/logo-icon-b.png" alt="" />
      </div>

      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2>Nuestra Esencia</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Como una noria que gira, cada proyecto es un ciclo creativo que eleva historias
            y conecta con las emociones del público.
          </p>
        </div>

        <div className={styles.grid}>
          {BRAND_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={`${styles.card} reveal`}
              onMouseEnter={() => card.spinning ? setHoveredIdx(i) : null}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className={styles.cardImg}>
                <img
                  src={card.img}
                  alt={card.title}
                  className={card.spinning && hoveredIdx === i ? styles.spinning : ''}
                />
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        <div className={`${styles.tagline} reveal`}>
          <span>"Giramos historias, elevamos emociones"</span>
        </div>
      </div>
    </section>
  )
}
