import { SOCIALS } from '../../../data'
import styles from './Footer.module.css'

const NAV_LINKS = ['nosotros', 'servicios', 'portafolio', 'talento']

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollTo = (anchor: string) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <img src="/assets/images/logo-full-b.png" alt="NORIA Films" />
            <p>Productora audiovisual dedicada a crear experiencias cinematográficas que inspiran y transforman.</p>
            <div className={styles.socials}>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}>{s.icon}</a>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <h4>Enlaces</h4>
            <ul>
              {NAV_LINKS.map((anchor) => (
                <li key={anchor}>
                  <button onClick={() => scrollTo(anchor)}>
                    {anchor.charAt(0).toUpperCase() + anchor.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:contacto@noriafilms.com">contacto@noriafilms.com</a></li>
              <li><a href="tel:+524490000000">+52 (449) 000-0000</a></li>
              <li>Aguascalientes, México</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} NORIA Creative Film Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
