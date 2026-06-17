import { useState } from 'react'
import { PROJECTS, PORTFOLIO_FILTERS } from '../../../../data'
import { useReveal } from '../../../../hooks/useReveal'
import styles from './Portfolio.module.css'

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('todos')
  const ref = useReveal(0.08)

  const filtered = activeFilter === 'todos'
    ? PROJECTS
    : PROJECTS.filter((p) => p.cat === activeFilter)

  return (
    <section id="portafolio" className={styles.portfolio} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <img src="/assets/images/logo-letras-b.png" alt="NORIA Films" className={styles.headerLogo} />
          <h2>Portafolio</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Una selección de nuestros proyectos más destacados que reflejan nuestra visión creativa.
          </p>
        </div>

        <div className={`${styles.filters} reveal`}>
          {PORTFOLIO_FILTERS.map((f) => (
            <button
              key={f.value}
              className={activeFilter === f.value ? styles.active : ''}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((p) => (
            <div key={p.id} className={`${styles.card} reveal`}>
              <img src={p.image} alt={p.title} />
              <div className={styles.overlay}>
                <div className={styles.playBtn}>▶</div>
              </div>
              <div className={styles.info}>
                <span className={styles.category}>{p.category}</span>
                <h3>{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
