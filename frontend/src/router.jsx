import { useEffect, useMemo, useSyncExternalStore } from 'react'

// Very small hash-based router without dependencies
const listeners = new Set()

function notify() {
  listeners.forEach((l) => l())
}

window.addEventListener('hashchange', notify)

export function navigate(path) {
  if (!path.startsWith('#')) {
    window.location.hash = '#' + path
  } else {
    window.location.hash = path
  }
}

function getHashPath() {
  const h = window.location.hash || '#/'
  return h.slice(1) || '/'
}

export function useLocation() {
  const subscribe = (cb) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }
  const snapshot = () => getHashPath()
  const path = useSyncExternalStore(subscribe, snapshot, snapshot)
  return path
}

function matchRoute(pattern, path) {
  // pattern like /posts/:id
  const pSegs = pattern.split('/').filter(Boolean)
  const aSegs = path.split('/').filter(Boolean)
  if (pSegs.length !== aSegs.length) return null
  const params = {}
  for (let i = 0; i < pSegs.length; i++) {
    const ps = pSegs[i]
    const as = aSegs[i]
    if (ps.startsWith(':')) {
      params[ps.slice(1)] = decodeURIComponent(as)
    } else if (ps !== as) {
      return null
    }
  }
  return params
}

export function RouterView({ routes }) {
  const path = useLocation()
  const match = useMemo(() => {
    // exact match first
    if (routes[path]) return { Comp: routes[path], params: {} }
    // param match
    for (const key of Object.keys(routes)) {
      const params = matchRoute(key, path)
      if (params) return { Comp: routes[key], params }
    }
    return null
  }, [path, routes])

  if (!match) {
    return <div className="page"><h2>404</h2><p>Không tìm thấy trang.</p></div>
  }
  const { Comp, params } = match
  return <Comp params={params} />
}

