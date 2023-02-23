import { Input, MidiMessage, Output } from 'midi';
import { Container, Control, Node } from './nodes';

export class Dispatcher {
  private readonly input: Input;
  private readonly output: Output;
  private readonly inputPort: number | string;
  private readonly outputPort: number | string;
  private readonly map: Map<number, Control> = new Map();

  constructor(input: number | string, output: number | string) {
    this.input = new Input();
    this.output = new Output();
    this.inputPort = input;
    this.outputPort = output;
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSet = this.handleSet.bind(this);
  }

  init(): void {
    this.input.openPort(resolvePort(this.input, this.inputPort));
    this.output.openPort(resolvePort(this.output, this.outputPort));
    this.input.on('message', this.handleMessage);
  }

  destroy(): void {
    for (const node of new Set(this.map.values())) {
      node.off('set', this.handleSet);
    }

    this.map.clear();
    this.input.closePort();
    this.output.closePort();
  }

  add(node: Node, recursive: boolean = true): void {
    if (recursive && node instanceof Container) {
      for (const child of node.children()) {
        this.add(child);
      }
    } else if (node instanceof Control) {
      for (const header of node.getSubscribedMessages()) {
        this.map.set(header, node);
      }
    }

    node.on('set', this.handleSet);
    node.init();

    if (!(node instanceof Control)) {
      node.off('set', this.handleSet);
    }
  }

  private handleMessage(dt: number, [status, id = 0, ...params]: MidiMessage): void {
    this.map.get((status << 8) | id)?.handle(status, id, ...params);
  }

  private handleSet(...message: MidiMessage): void {
    this.output.send(message);
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
