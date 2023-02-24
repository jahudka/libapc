import { AbstractOSCPort, EventEmitter, osc, OSCMessage } from '@mxfriend/osc';
import { Adapter, AdapterEvents } from './types';

export class OscAdapter extends EventEmitter<AdapterEvents> implements Adapter {
  private readonly port: AbstractOSCPort;
  private readonly address: string;

  constructor(port: AbstractOSCPort, address: string) {
    super();
    this.port = port;
    this.address = address;
    this.handleMessage = this.handleMessage.bind(this);
  }

  init(): void {
    this.port.subscribe(this.address, this.handleMessage);
  }

  destroy(): void {
    this.port.unsubscribe(this.address, this.handleMessage);
  }

  async send(message: number[]): Promise<void> {
    await this.port.send(this.address, osc.compose('...i', message));
  }

  private handleMessage({ args }: OSCMessage): void {
    const [message] = osc.extract(args, '...i');
    message && message.length && this.emit('message', message);
  }
}
