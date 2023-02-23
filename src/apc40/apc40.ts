import { Button, Container, Encoder, Property } from '../om';
import {
  Apc40BankControls,
  Apc40DeviceControls,
  Apc40TempoControls,
  Apc40TrackControls,
  Apc40TransportControls,
} from './controls';
import { Apc40MasterTrack, Apc40Track } from './tracks';

export class Apc40 extends Container {
  @Property readonly tracks = new Array(8).fill(null).map((_, i) => new Apc40Track(i));
  @Property readonly master = new Apc40MasterTrack();
  @Property readonly track = new Apc40TrackControls();
  @Property readonly shift = new Button(0x62);
  @Property readonly bank = new Apc40BankControls();
  @Property readonly tempo = new Apc40TempoControls();
  @Property readonly device = new Apc40DeviceControls();
  @Property readonly transport = new Apc40TransportControls();
  @Property readonly crossfader = new Encoder(0x0f);

  init(): void {
    this.emit('set', 0xf0, 0x47, 0x00, 0x73, 0x60, 0x00, 0x04, 0x42, 0x01, 0x00, 0x00, 0xf7);
    super.init();
  }
}
