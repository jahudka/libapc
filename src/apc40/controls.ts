import { ApcBinaryButtonState, ApcLEDButton } from '../common';
import { Button, Container, Encoder, MIDIMessageType, Node, Property } from '../om';

export enum Apc40EncoderMode {
  Off = 0,
  Single = 1,
  Volume = 2,
  Pan = 3,
}

export class Apc40Encoder extends Encoder {
  constructor(cc: number) {
    super(cc, 0, 0);
  }

  init(): void {
    this.setMode(Apc40EncoderMode.Off);
    super.init();
  }

  setMode(mode: Apc40EncoderMode): void {
    this.emit('set', MIDIMessageType.CC | this.channel, this.cc + 8, mode);
  }
}

export class Apc40TrackControls extends Container {
  readonly encoders = new Array(8).fill(null).map((_, i) => new Apc40Encoder(0x30 + i));
  @Property readonly pan = new ApcLEDButton<ApcBinaryButtonState>(0x57);
  @Property readonly sendA = new ApcLEDButton<ApcBinaryButtonState>(0x58);
  @Property readonly sendB = new ApcLEDButton<ApcBinaryButtonState>(0x59);
  @Property readonly sendC = new ApcLEDButton<ApcBinaryButtonState>(0x5a);

  children(keys?: false): Iterable<Node>;
  children(keys: true): Iterable<[string | number, Node]>;
  * children(keys?: boolean): Iterable<Node | [string | number, Node]> {
    yield * keys ? this.encoders.entries() : this.encoders.values();
    yield * super.children(keys as any);
  }

  public * [Symbol.iterator](): Iterable<Node> {
    yield * this.encoders;
  }
}

export class Apc40DeviceControls extends Container {
  readonly encoders = new Array(8).fill(null).map((_, i) => new Apc40Encoder(0x10 + i));
  @Property readonly clipTrack = new ApcLEDButton<ApcBinaryButtonState>(0x3a);
  @Property readonly deviceOn = new ApcLEDButton<ApcBinaryButtonState>(0x3b);
  @Property readonly prev = new ApcLEDButton<ApcBinaryButtonState>(0x3c);
  @Property readonly next = new ApcLEDButton<ApcBinaryButtonState>(0x3d);
  @Property readonly detail = new ApcLEDButton<ApcBinaryButtonState>(0x3e);
  @Property readonly recQuant = new ApcLEDButton<ApcBinaryButtonState>(0x3f);
  @Property readonly overdub = new ApcLEDButton<ApcBinaryButtonState>(0x40);
  @Property readonly metronome = new ApcLEDButton<ApcBinaryButtonState>(0x41);

  children(keys?: false): Iterable<Node>;
  children(keys: true): Iterable<[string | number, Node]>;
  * children(keys?: boolean): Iterable<Node | [string | number, Node]> {
    yield * keys ? this.encoders.entries() : this.encoders.values();
    yield * super.children(keys as any);
  }

  public * [Symbol.iterator](): Iterable<Node> {
    yield * this.encoders;
  }
}

export class Apc40TempoControls extends Container {
  @Property readonly tap = new Button(0x63);
  @Property readonly inc = new Button(0x64);
  @Property readonly dec = new Button(0x65);
}

export class Apc40BankControls extends Container {
  @Property readonly up = new Button(0x5e);
  @Property readonly down = new Button(0x5f);
  @Property readonly right = new Button(0x60);
  @Property readonly left = new Button(0x61);
}

export class Apc40TransportControls extends Container {
  @Property readonly play = new Button(0x5b);
  @Property readonly stop = new Button(0x5c);
  @Property readonly record = new Button(0x5d);
}
