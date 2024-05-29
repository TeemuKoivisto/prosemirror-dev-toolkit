export type Ok<T> = {
  data: T
}
export type Err = {
  err: string
  code: number
}
export type Result<T> = Ok<T> | Err
