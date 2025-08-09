import {Line} from "./line";
import {Direction} from "./direction";

export type Monitor = {
  diva: string,
  line: Line,
  directions: Direction[]
}

export type MonitorRequestDto = {
  diva: string,
  lineName: string
}
