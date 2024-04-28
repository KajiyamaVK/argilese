// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IDBResponse<T = any> {
  data?: T
  message: string
  isError: boolean

  affectedRows?: number
  insertId?: number
}
