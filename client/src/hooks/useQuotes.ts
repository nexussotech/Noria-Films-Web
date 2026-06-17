import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api'
import type { QuoteItem } from '../types'

export function useQuotes() {
  const [quotes,  setQuotes]  = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get<QuoteItem[]>('/quotes/my')
      setQuotes(data)
    } catch {
      setError('No se pudieron cargar las cotizaciones')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  return { quotes, loading, error, refetch: load }
}
