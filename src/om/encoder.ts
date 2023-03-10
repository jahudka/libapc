import { Control, NodeEvents } from './nodes';
import { EncoderMode, MIDIMessageType } from './types';

export interface EncoderEvents extends NodeEvents {
  change: [encoder: Encoder, value: number];
}

export class Encoder extends Control<EncoderEvents> {
  public readonly cc: number;
  public readonly channel: number;
  private readonly initial?: number;

  constructor(cc: number, channel: number = 0, initial?: number) {
    super();
    this.channel = channel & 0xf;
    this.cc = cc & 0x7f;
    this.initial = initial;
  }

  * getSubscribedMessages(): Iterable<number> {
    yield ((MIDIMessageType.CC | this.channel) << 8) | this.cc;
  }

  init(): void {
    if (this.initial !== undefined) {
      this.set(this.initial);
    }
  }

  handle(status: number, id: number, value: number): void {
    this.emit('change', this, value);
  }

  set(value: number): void {
    this.emit('set', MIDIMessageType.CC | this.channel, this.cc, value & 0x7f);
  }

  setMode(mode: EncoderMode): void {
    // this is a hint, encoders can implement modes however they wish
  }
}
