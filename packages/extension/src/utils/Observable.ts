type EventMap = {
  [key: string]: (...args: any[]) => void
}

export class Observable<Events extends EventMap> {
  private observers = new Map<
    keyof Events,
    Set<(...args: Parameters<Events[keyof Events]>) => void>
  >()

  on<K extends keyof Events>(key: K, cb: (...args: Parameters<Events[K]>) => void) {
    const current = this.observers.get(key)
    if (current) {
      this.observers.set(key, new Set(current.add(cb)))
    } else {
      this.observers.set(key, new Set([cb]))
    }
  }

  once<K extends keyof Events>(key: K, cb: (...args: Parameters<Events[K]>) => void) {
    const fn = (...args2: Parameters<Events[K]>) => {
      this.off(key, fn)
      cb(...args2)
    }
    this.on(key, fn)
  }

  off<K extends keyof Events>(key: K, cb: (...args: Parameters<Events[K]>) => void) {
    const observers = this.observers.get(key)
    if (observers) {
      observers.delete(cb)
      if (observers.size === 0) {
        this.observers.delete(key)
      }
    }
  }

  emit<K extends keyof Events>(key: K, ...args: Parameters<Events[K]>) {
    return Array.from((this.observers.get(key) || new Set()).values()).forEach(cb => cb(...args))
  }

  destroy() {
    this.observers = new Map()
  }
}
