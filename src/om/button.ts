import { Control } from './nodes';
import { MIDIMessageType } from './types';

export class Button extends Control {
  private readonly note: number;
  private readonly channel: number;
  private readonly initial?: number;

  constructor(note: number, channel: number = 0, initial?: number) {
    super();
    this.channel = channel & 0xf;
    this.note = note & 0x7f;
    this.initial = initial;
  }

  * getSubscribedMessages(): Iterable<number> {
    yield ((MIDIMessageType.NoteOn | this.channel) << 8) | this.note;
    yield ((MIDIMessageType.NoteOff | this.channel) << 8) | this.note;
  }

  init(): void {
    if (this.initial !== undefined) {
      this.set(this.initial);
    }
  }

  handle(status: number, id: number, velocity: number): void {
    this.emit((status & 0xf0) === MIDIMessageType.NoteOff || velocity === 0 ? 'release' : 'press', this);
  }

  set(state: number): void {
    this.emit('set', MIDIMessageType.NoteOn | this.channel, this.note, state & 0xf0);
  }
}
