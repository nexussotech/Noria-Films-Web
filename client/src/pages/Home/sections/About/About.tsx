import { FEATURES } from '../../../../data'
import { useReveal } from '../../../../hooks/useReveal'
import styles from './About.module.css'

export default function About() {
  const ref = useReveal()

  return (
    <section id="nosotros" className={styles.about} ref={ref as React.RefObject<HTMLElement>}>
      <div className={styles.watermark}>
        <img src="/assets/images/logo-icon-n.png" alt="" />
      </div>

      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2>Sobre Nosotros</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Somos una productora audiovisual dedicada a crear contenido cinematográfico de alta calidad,
            impulsando proyectos culturales y apoyando el talento emergente en la industria.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.image} reveal-left`}>
            <img
              src="/assets/images/noria/about.jpg"
              alt="NORIA Films — equipo de producción"
              loading="lazy"
            />
          </div>
          <div className={`${styles.features} reveal-right`}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.feature}>
                <div className={styles.icon}>
                  <img src="/assets/images/logo-icon-b.png" alt="" />
                </div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
