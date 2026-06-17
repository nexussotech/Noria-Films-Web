import { useState, type FormEvent } from 'react'
import { useReveal } from '../../../../hooks/useReveal'
import api from '../../../../lib/api'
import styles from './Contact.module.css'

interface FormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const INITIAL: FormState = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm]         = useState<FormState>(INITIAL)
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const ref = useReveal(0.08)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await api.post('/contact', {
        full_name: form.name,
        email:     form.email,
        phone:     form.phone || undefined,
        subject:   form.subject,
        message:   form.message,
      })
      setStatus('success')
      setForm(INITIAL)
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className={styles.contact} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <img src="/assets/images/logo-full-b.png" alt="NORIA Films" className={styles.contactLogo} />
          <h2>Contacto</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Conversemos sobre tu proyecto. Estamos listos para convertir tu visión en realidad.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.info} reveal-left`}>
            <h3>Información de Contacto</h3>
            <div className={styles.infoList}>
              {[
                { icon: '@', label: 'Email', content: <a href="mailto:contacto@noriafilms.com">contacto@noriafilms.com</a> },
                { icon: 'Tel', label: 'Teléfono', content: <a href="tel:+524490000000">+52 (449) 000-0000</a> },
                { icon: 'Ags', label: 'Ubicación', content: <p>Aguascalientes, México</p> },
              ].map((item) => (
                <div key={item.label} className={styles.infoItem}>
                  <div className={styles.infoIcon}>{item.icon}</div>
                  <div>
                    <p className={styles.infoLabel}>{item.label}</p>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
            <img
              src="/assets/images/noria/about.jpg"
              alt="NORIA Films — producción"
              className={styles.contactImg}
              loading="lazy"
            />
          </div>

          <div className={`reveal-right`}>
            {status === 'success' && (
              <div className={styles.success}>
                Mensaje enviado con éxito. Te contactaremos pronto.
              </div>
            )}
            {status === 'error' && (
              <div className={styles.error}>
                Ocurrió un error al enviar el mensaje. Intenta de nuevo.
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {(
                [
                  { name: 'name',    label: 'Nombre',   type: 'text',  placeholder: 'Tu nombre completo',       required: true },
                  { name: 'email',   label: 'Email',    type: 'email', placeholder: 'tu@email.com',             required: true },
                  { name: 'phone',   label: 'Teléfono', type: 'tel',   placeholder: '+52 (449) 000-0000',       required: false },
                  { name: 'subject', label: 'Asunto',   type: 'text',  placeholder: '¿En qué podemos ayudarte?',required: true },
                ] as const
              ).map((field) => (
                <div key={field.name} className={styles.formGroup}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={form[field.name as keyof FormState]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className={styles.formGroup}>
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Cuéntanos sobre tu proyecto..."
                  required
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
