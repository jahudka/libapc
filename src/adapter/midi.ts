import { EventEmitter } from '@mxfriend/osc';
import { Input, MidiMessage, Output } from '@julusian/midi';
import { Adapter, AdapterEvents } from './types';

export class MidiAdapter extends EventEmitter<AdapterEvents> implements Adapter {
  private readonly input: Input = new Input();
  private readonly output: Output = new Output();
  private readonly inputPort: string | number;
  private readonly outputPort: string | number;

  constructor(inputPort: string | number, outputPort: string | number) {
    super();
    this.inputPort = inputPort;
    this.outputPort = outputPort;
    this.handleMessage = this.handleMessage.bind(this);
  }

  init(): Promise<void> | void {
    this.input.openPort(resolvePort(this.input, this.inputPort));
    this.output.openPort(resolvePort(this.output, this.outputPort));
    this.input.on('message', this.handleMessage);
  }

  destroy(): Promise<void> | void {
    this.input.closePort();
    this.output.closePort();
  }

  send(message: number[]): void {
    this.output.send(message as MidiMessage);
  }

  private handleMessage(dt: number, message: MidiMessage): void {
    this.emit('message', message);
  }
}

function resolvePort(io: Input | Output, port: number | string): number {
  if (typeof port === 'number') {
    return port;
  }

  for (let i = 0, n = io.getPortCount(); i < n; ++i) {
    if (io.getPortName(i) === port) {
      return i;
    }
  }

  throw new Error(`Unknown MIDI port: ${port}`);
}
