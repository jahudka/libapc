import {
  ApcBinaryButtonState,
  ApcBlinkingButtonState,
  ApcLEDButton,
  ApcThreeColourButtonMode,
} from '../common';
import { Button, Container, Encoder, Node, Property } from '../om';

export class Apc40Track extends Container {
  readonly clips: ApcLEDButton<ApcThreeColourButtonMode>[];
  @Property readonly stop: ApcLEDButton<ApcBlinkingButtonState>;
  @Property readonly select: ApcLEDButton<ApcBinaryButtonState>;
  @Property readonly activator: ApcLEDButton<ApcBinaryButtonState>;
  @Property readonly solo: ApcLEDButton<ApcBinaryButtonState>;
  @Property readonly recArm: ApcLEDButton<ApcBinaryButtonState>;
  @Property readonly fader: Encoder;

  constructor(n: number) {
    super();
    this.clips = new Array(5).fill(null).map((_, i) => new ApcLEDButton(0x35 + i, n));
    this.stop = new ApcLEDButton(0x34, n);
    this.select = new ApcLEDButton(0x33, n);
    this.activator = new ApcLEDButton(0x32, n);
    this.solo = new ApcLEDButton(0x31, n);
    this.recArm = new ApcLEDButton(0x30, n);
    this.fader = new Encoder(0x07, n);
  }

  children(keys?: false): Iterable<Node>;
  children(keys: true): Iterable<[string | number, Node]>;
  * children(keys?: boolean): Iterable<Node | [string | number, Node]> {
    yield * keys ? this.clips.entries() : this.clips.values();
    yield * super.children(keys as any);
  }

  public * [Symbol.iterator](): Iterable<Node> {
    yield * this.clips;
  }
}

export class Apc40CueLevel extends Encoder {
  constructor() {
    super(0x2f);
  }

  handle(status: number, id: number, value: number) {
    super.handle(status, id, value > 0x3f ? value - 0x80 : value);
  }
}

export class Apc40MasterTrack extends Container {
  readonly scenes: ApcLEDButton<ApcBlinkingButtonState>[];
  @Property readonly stopAll = new Button(0x51);
  @Property readonly select = new ApcLEDButton<ApcBinaryButtonState>(0x50);
  @Property readonly cueLevel = new Apc40CueLevel();
  @Property readonly fader = new Encoder(0x0e);

  constructor() {
    super();
    this.scenes = new Array(5).fill(null).map((_, i) => new ApcLEDButton(i + 0x52));
  }

  children(keys?: false): Iterable<Node>;
  children(keys: true): Iterable<[string | number, Node]>;
  * children(keys?: boolean): Iterable<Node | [string | number, Node]> {
    yield * keys ? this.scenes.entries() : this.scenes.values();
    yield * super.children(keys as any);
  }

  public * [Symbol.iterator](): Iterable<Node> {
    yield * this.scenes;
  }
}
