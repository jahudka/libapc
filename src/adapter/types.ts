import { EventEmitter, EventMap } from '@mxfriend/osc';

export interface AdapterEvents extends EventMap {
  message: [message: number[]];
}

export interface Adapter extends EventEmitter<AdapterEvents> {
  init(): Promise<void> | void;
  destroy(): Promise<void> | void;
  send(message: number[]): Promise<void> | void;
}
