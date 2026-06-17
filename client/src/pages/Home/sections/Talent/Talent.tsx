import { PILLARS } from '../../../../data'
import { useReveal } from '../../../../hooks/useReveal'
import styles from './Talent.module.css'

export default function Talent() {
  const ref = useReveal(0.1)

  const scrollToContact = () =>
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="talento" className={styles.talent} ref={ref as React.RefObject<HTMLElement>}>
      <div className={styles.watermark}>
        <img src="/assets/images/logo-icon-b.png" alt="" />
      </div>

      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2>Talento Emergente</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Creemos en el poder de las nuevas voces. Por eso creamos espacios y oportunidades
            para que nuevos creadores desarrollen su potencial.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.pillars} reveal-left`}>
            {PILLARS.map((p) => (
              <div key={p.title} className={styles.pillar}>
                <div className={styles.pillarIcon}>
                  <img src="/assets/images/logo-icon-b.png" alt="" />
                </div>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`${styles.imageWrap} reveal-right`}>
            <img
              src="https://images.unsplash.com/photo-1681137063068-081072cf04b4?w=800&q=80"
              alt="Talento emergente"
            />
            <div className={styles.accent} />
          </div>
        </div>

        <div className={`${styles.cta} reveal`}>
          <h3>¿Tienes un proyecto en mente?</h3>
          <p>
            Si eres un creador emergente con una historia que contar, nos encantaría conocer
            tu propuesta y explorar cómo podemos colaborar.
          </p>
          <button className={styles.ctaBtn} onClick={scrollToContact}>
            Envía tu Propuesta
          </button>
        </div>
      </div>
    </section>
  )
}
