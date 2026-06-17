import { SERVICES } from '../../../../data'
import { useReveal } from '../../../../hooks/useReveal'
import styles from './Services.module.css'

export default function Services() {
  const ref = useReveal(0.08)

  return (
    <section id="servicios" className={styles.services} ref={ref as React.RefObject<HTMLElement>}>
      <div className={styles.watermark}>
        <img src="/assets/images/logo-icon-b.png" alt="" />
      </div>

      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2>Nuestros Servicios</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Ofrecemos soluciones integrales de producción audiovisual adaptadas a las necesidades de cada proyecto.
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <div key={s.id} className={`${styles.card} reveal`}>
              <div className={styles.cardImage}>
                <img src={s.image_url} alt={s.title} />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardIcon}>
                  <img src="/assets/images/logo-icon-b.png" alt="" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
