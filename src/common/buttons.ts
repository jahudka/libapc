import { Button } from '../om';

export enum ApcBinaryButtonState {
  Off = 0,
  On = 1,
}

export enum ApcBlinkingButtonState {
  Off = 0,
  On = 1,
  Blink = 2,
}

export enum ApcThreeColourButtonMode {
  Off = 0,
  Green = 1,
  GreenBlink = 2,
  Red = 3,
  RedBlink = 4,
  Yellow = 5,
  YellowBlink = 6,
}

export class ApcLEDButton<S extends number> extends Button {
  constructor(note: number, channel: number = 0) {
    super(note, channel, 0);
  }

  set(state: S): void {
    super.set(state);
  }
}
