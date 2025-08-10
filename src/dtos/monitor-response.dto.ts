import { LineType } from "../models/line";

export interface MonitorResponseDto {
  data: { monitors: MonitorDto[] },
  message: { value: string, messageCode: number, serverTime: Date }
}

export interface MonitorDto {
  locationStop: LocationStopDto,
  lines: LineDto[]
}

export interface LocationStopDto {
  geometry: any,
  properties: LocationStopPropertiesDto,
  type: string,
}

export interface LocationStopPropertiesDto {
  name: string,
  title: string,
  type: string,
  attributes: any
}

export interface LineDto {
  name: string,
  towards: string,
  platform: string,
  richtungsId: string,
  barrierFree: boolean,
  realtimeSupported: boolean,
  trafficjam: boolean,
  departures: {
    departure: DepartureDto[]
  },
  type: LineType,
  lineId: number
}

export interface DepartureDto {
  departureTime: DepartureTimeDto,
}

export interface DepartureTimeDto {
  timePlanned: Date,
  timeReal: Date,
  countdown: number
}
