export enum Action {
  Success = 'success',
  Cancel = 'cancel',
}

export interface ModalAction {
  label: string;
  value: Action;
}
