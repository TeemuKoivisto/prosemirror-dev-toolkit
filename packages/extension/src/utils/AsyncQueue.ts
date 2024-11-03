export class AsyncQueue<T> {
  private readonly queue: Promise<T | undefined>[] = []
  private readonly timeoutSeconds: number
  private timeout: ReturnType<typeof setTimeout> | undefined
  private reject = () => {}
  private resolve = (value: T | PromiseLike<T>) => {}

  /**
   * @param timeout timeout in seconds @default 25
   */
  constructor(timeout = 25) {
    this.timeoutSeconds = timeout
    if (timeout > 100) {
      console.warn(`You are initializing AsyncQueue with over 100s timeout: ${timeout}`)
    }
    this.queue.push(
      new Promise<T | undefined>((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
        this.timeout = setTimeout(() => resolve(undefined), timeout * 1000)
      })
    )
  }

  next(): Promise<T | undefined> | undefined {
    return this.queue.shift()
  }

  push(msg: T) {
    this.resolve(msg)
    this.queue.push(
      new Promise<T | undefined>((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => resolve(undefined), this.timeoutSeconds * 1000)
      })
    )
  }

  close(msg?: T) {
    if (msg) {
      this.resolve(msg)
    }
    clearTimeout(this.timeout)
  }
}
