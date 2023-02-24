export enum MIDIMessageType {
  NoteOff = 0x80,
  NoteOn = 0x90,
  CC = 0xb0,
}

/**
 * This is just a hint - encoders can implement any of these
 * modes, or they can implement their own
 */
export type EncoderMode =
  | 'off' // encoder LEDs are off
  | 'single' // single LED active at any one time
  | 'gain' // gauge-style - all LEDs from 0 to current value are active
  | 'pan' // gauge-style with center at 12 o'clock
  | 'width' // LEDs activating from 12 o'clock symmetrically towards both ends
  | string;
