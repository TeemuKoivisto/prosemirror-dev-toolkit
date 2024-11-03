export type Ok<T> = {
  data: T
}
export type Err = {
  err: string
  code: number
}
export type Result<T> = Ok<T> | Err

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
