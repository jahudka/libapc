import {
  ApcBinaryButtonState,
  ApcBlinkingButtonState,
  ApcLEDButton,
  ApcThreeColourButtonMode,
} from '../common';
import { Button, Container, Encoder, Node, Property } from '../om';

export class ApcMiniTrack extends Container {
  readonly clips: ApcLEDButton<ApcThreeColourButtonMode>[];
  @Property readonly select: ApcLEDButton<ApcBinaryButtonState>;
  @Property readonly fader: Encoder;

  constructor(n: number) {
    super();
    this.clips = new Array(8).fill(null).map((_, i) => new ApcLEDButton(8 * (7 - i) + n));
    this.select = new ApcLEDButton(0x40 + n);
    this.fader = new Encoder(0x30 + n);
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

export class ApcMiniMasterTrack extends Container {
  readonly scenes = new Array(8).fill(null).map((_, i) => {
    return new ApcLEDButton<ApcBlinkingButtonState>(0x52 + i);
  });

  @Property readonly shift = new Button(0x62);
  @Property readonly fader = new Encoder(0x38);

  get clipStop(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[0];
  }

  get solo(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[1];
  }

  get recArm(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[2];
  }

  get mute(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[3];
  }

  get select(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[4];
  }

  get custom1(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[5];
  }

  get custom2(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[6];
  }

  get stopAll(): ApcLEDButton<ApcBlinkingButtonState> {
    return this.scenes[7];
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
