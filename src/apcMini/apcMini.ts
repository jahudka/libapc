import { Container, Property } from '../om';
import { ApcMiniMasterTrack, ApcMiniTrack } from './tracks';

export class ApcMini extends Container {
  @Property tracks = new Array(8).fill(null).map((_, i) => new ApcMiniTrack(i));
  @Property master = new ApcMiniMasterTrack();
}
