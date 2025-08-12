import { inject, Injectable, OnDestroy, signal, Signal, WritableSignal } from "@angular/core";
import { Monitor } from "../../models/monitor";
import { HttpClient, HttpParams } from "@angular/common/http";
import { DepartureDto, LineDto, MonitorDto, MonitorResponseDto } from "../../dtos/monitor-response.dto";
import { map, Observable, tap } from "rxjs";
import { MonitorDescriptor } from "../../models/monitor-descriptor";
import { Line } from "../../models/line";
import { Direction } from "../../models/direction";
import { ReferenceService } from "./reference.service";
import Multimap from "multimap";

@Injectable({
  providedIn: "root"
})
export class MonitorService implements OnDestroy {

  private static readonly BASE_URL: string = "/api/ogd_realtime"
  private static readonly MONITORS_ENDPOINT: string = "monitor";
  private referenceService: ReferenceService = inject(ReferenceService);
  private http: HttpClient = inject(HttpClient);
  private monitorRequests: Set<MonitorDescriptor> = new Set<MonitorDescriptor>();
  private signals: Map<MonitorDescriptor, WritableSignal<Monitor | null>> = new Map();
  private isRunning: boolean = false;

  ngOnDestroy(): void {
    this.stop();
  }

  /**
   * Registers the monitor at this service.
   * <p>
   * This means, this service will produce results for the given monitor descriptor.
   *
   * @param monitorDescriptor the descriptor of the monitor to register
   * @returns a signal of actual monitor or {@code null} if not found.
   */
  register(monitorDescriptor: MonitorDescriptor): Signal<Monitor | null> {
    this.monitorRequests.add(monitorDescriptor);
    if (!this.signals.has(monitorDescriptor)) {
      this.signals.set(monitorDescriptor, signal<Monitor | null>(null));
    }
    return this.signals.get(monitorDescriptor)!;
  }

  deregister(monitorDescriptor: MonitorDescriptor): void {
    this.monitorRequests.delete(monitorDescriptor);
    this.signals.delete(monitorDescriptor);
  }

  /**
   * Starts this service.
   */
  start(): void {
    if (this.isRunning) return;
    // TODO: fetch data each 15 seconds
    this.fetchMonitors();
  }

  /**
   * Stops this service.
   */
  stop(): void {
    this.isRunning = false;
    // TODO: stop fetching
  }

  private isRequested(monitorDescriptor: MonitorDescriptor): boolean {
    return this.monitorRequests.has(monitorDescriptor);
  }

  /**
   * Updates the signals based on the given map of monitors.
   * <p>
   * Based on the given monitors, all signals in this will be updated.
   *
   * @param monitors a map of monitors that carry the new values for the signals
   * @private
   */
  private updateSignals(monitors: Map<MonitorDescriptor, Monitor>): void {
    monitors.forEach((monitor: Monitor, monitorDescriptor: MonitorDescriptor) => {
      const signal: WritableSignal<Monitor | null> | undefined = this.signals.get(monitorDescriptor);
      if (signal) {
        signal.set(monitor);
      }
    });
  }

  /**
   * Maps the API response object to the map of monitors.
   *
   * @param response the response of the API call
   * @private
   */
  private mapRawMonitors(response: MonitorResponseDto): Map<MonitorDescriptor, Monitor> {
    const result = new Map<MonitorDescriptor, Monitor>();
    const stations: Multimap<string, MonitorDto> = new Multimap<string, MonitorDto>;
    response.data.monitors.forEach(monitor => {
      const stopTitle: string = monitor.locationStop.properties.title;
      stations.set(stopTitle, monitor);
    });
    for (let key of stations.keys()) {
      const lineDtos = stations.get(key)!.map((monitor: MonitorDto): LineDto => {
        return monitor.lines[0];
      });
      const monitor: MonitorDto = stations.get(key)![0];
      const diva: string = monitor.locationStop.properties.name;
      const lineName: string = monitor.lines[0].name;
      const monitorDescriptor: MonitorDescriptor = this.referenceService.getMonitorDescriptor(diva, lineName);
      if (this.isRequested(monitorDescriptor)) {
        result.set(monitorDescriptor, this.lineDtosToMonitor(diva, lineDtos));
      }
    }
    return result;
  }

  private lineDtosToMonitor(diva: string, lineDtos: LineDto[]): Monitor {
    const line: Line = {
      id: lineDtos[0].lineId,
      name: lineDtos[0].name,
      type: lineDtos[0].type,
    }
    const directions: Direction[] = this.lineDtosToDirections(lineDtos);
    return {
      diva: diva,
      line: line,
      directions: directions,
    }
  }

  private lineDtosToDirections(lineDtos: LineDto[]): Direction[] {
    const directionMap: Map<number, LineDto> = new Map();
    lineDtos.forEach((line: LineDto) => {
      const directionId: number = Number.parseInt(line.richtungsId);
      if (!directionMap.has(directionId)) {
        directionMap.set(directionId, line);
      }
    });
    const results: Direction[] = [];
    directionMap.forEach((line: LineDto, directionId: number) => {
      results.push({
        directionId: directionId,
        towards: line.towards,
        nextArrivalTime: line.departures.departure[0]?.departureTime.timeReal
      });
    });
    return results.sort((a, b) => a.directionId - b.directionId);
  }

  /**
   * Fetches the monitors and post processes the response.
   *
   * @private
   */
  private fetchMonitors(): void {
    this.fetchRaw()
      .pipe(tap((response) => {
        this.updateSignals(this.mapRawMonitors(response));
      })).subscribe();
  }

  /**
   * Fetches the raw monitor data.
   *
   * @private
   */
  private fetchRaw(): Observable<MonitorResponseDto> {
    let params = new HttpParams();
    this.monitorRequests.forEach((monitorDescriptor: MonitorDescriptor) => {
      params = params.append("diva", monitorDescriptor.diva);
    })
    return this.http.get<MonitorResponseDto>(`${MonitorService.BASE_URL}/${MonitorService.MONITORS_ENDPOINT}`, { params: params })
      .pipe(
        map((response: MonitorResponseDto): MonitorResponseDto => {
          response.message.serverTime = new Date(response.message.serverTime);
          response.data.monitors.forEach((monitor: MonitorDto) => {
            monitor.lines.forEach((line: LineDto) => {
              line.departures.departure.forEach((departure: DepartureDto) => {
                departure.departureTime.timePlanned = new Date(departure.departureTime.timePlanned);
                departure.departureTime.timeReal = new Date(departure.departureTime.timeReal);
              });
            })
          })
          return response;
        })
      )
  }
}
