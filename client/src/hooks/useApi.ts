import { useCallback, useEffect, useRef, useState } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

type Fetcher<T> = () => Promise<{ data: T }>

export function useApi<T>(fetcher: Fetcher<T>, deps: unknown[] = []) {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: true, error: null })
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetcherRef.current()
      setState({ data: res.data, loading: false, error: null })
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Error al cargar datos'
      setState({ data: null, loading: false, error: msg })
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void run() }, [run])

  return { ...state, refetch: run }
}
