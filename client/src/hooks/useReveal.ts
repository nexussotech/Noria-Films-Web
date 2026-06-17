import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold }
    )

    el.querySelectorAll<Element>('.reveal, .reveal-left, .reveal-right').forEach((node) => {
      observer.observe(node)
    })

    return () => observer.disconnect()
  }, [threshold])

  return ref
}
