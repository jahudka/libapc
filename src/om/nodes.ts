import { EventEmitter } from 'node:events';

export abstract class Node extends EventEmitter {
  public init(): void {}
}

export abstract class Control extends Node {
  constructor() {
    super();
  }

  public abstract getSubscribedMessages(): Iterable<number>;
  public abstract handle(status: number, id: number, ...params: number[]): void;
}

export abstract class Container extends Node {
  constructor() {
    super();
  }

  public children(keys?: false): Iterable<Node>;
  public children(keys: true): Iterable<[string | number, Node]>;
  public * children(keys?: boolean): Iterable<Node | [string | number, Node]> {
    const self: Record<string, Node> = this as any;

    for (const prop of getKnownProperties(this)) {
      yield keys ? [prop, self[prop]] : self[prop];
    }
  }
}

export function Property(target: any, property: string): void {
  const props = Reflect.getMetadata('custom:known-properties', target) ?? [];
  Reflect.defineMetadata('custom:known-properties', props.concat(property), target);
}

export function getKnownProperties(target: any): any[] {
  return Reflect.getMetadata('custom:known-properties', target) ?? [];
}
