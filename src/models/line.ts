export interface Line {
  id: number,
  name: string,
  type: LineType
}

export enum LineType {
  METRO = "ptMetro",
  TRAM = "ptTram",
  WLB = "ptTramWLB",
  BUS = "ptBusCity",
  NIGHT_LINE = "ptBusNight",
  S_LINE = "ptTrainS"
}
