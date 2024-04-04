export type TDialog = 'OK' | 'YN'

export interface IDialog {
  message: string
  type: TDialog
}
