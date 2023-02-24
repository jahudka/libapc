import { Adapter } from '../adapter';
import { Container, Control, Node } from './nodes';

export class Dispatcher {
  private readonly adapter: Adapter;
  private readonly map: Map<number, Control> = new Map();

  constructor(adapter: Adapter) {
    this.adapter = adapter;
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSet = this.handleSet.bind(this);
  }

  async init(): Promise<void> {
    this.adapter.init();
    this.adapter.on('message', this.handleMessage);
  }

  async destroy(): Promise<void> {
    for (const node of new Set(this.map.values())) {
      node.off('set', this.handleSet);
    }

    this.map.clear();
    await this.adapter.destroy();
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

  private handleMessage([status, id = 0, ...params]: number[]): void {
    this.map.get((status << 8) | id)?.handle(status, id, ...params);
  }

  private async handleSet(...message: number[]): Promise<void> {
    await this.adapter.send(message);
  }
}
