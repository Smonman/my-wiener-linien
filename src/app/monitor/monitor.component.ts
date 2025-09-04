import { Component, inject, input, InputSignal, OnDestroy, OnInit, Signal } from "@angular/core";
import { TitleCasePipe, UpperCasePipe } from "@angular/common";
import { MonitorService } from "../services/monitor.service";
import { Monitor } from "../../models/monitor";
import { MonitorDescriptor } from "../../models/monitor-descriptor";
import { LineType } from "../../models/line";

@Component({
  selector: "app-monitor",
  imports: [UpperCasePipe, TitleCasePipe],
  templateUrl: "./monitor.component.html",
  styleUrl: "./monitor.component.css"
})
export class MonitorComponent implements OnInit, OnDestroy {

  readonly monitorDescriptor: InputSignal<MonitorDescriptor> = input.required<MonitorDescriptor>();
  protected monitorSignal: Signal<Monitor | null> | undefined;
  private monitorService: MonitorService = inject(MonitorService);

  ngOnInit(): void {
    this.monitorSignal = this.monitorService.register(this.monitorDescriptor());
  }

  ngOnDestroy(): void {
    this.monitorService.deregister(this.monitorDescriptor());
  }

  protected monitorClasses(): string[] {
    const classes: string[] = [];
    if (this.monitorSignal && this.monitorSignal()) {
      switch (this.monitorSignal()?.line.type) {
        case LineType.METRO:
          classes.push(this.getUndergroundColor(this.monitorSignal()?.line.name));
          break;
        case LineType.TRAM:
          classes.push("border-bim");
          break;
        case LineType.WLB:
          classes.push("border-wlb");
          break;
        case LineType.BUS:
          classes.push("border-bus");
          break;
        case LineType.NIGHT_LINE:
          classes.push("border-bus");
          break;
        case LineType.S_LINE:
          classes.push("border-sb");
          break;
      }
    }
    return classes;
  }

  protected getUndergroundColor(lineName: string | undefined | null): string {
    switch (lineName?.toUpperCase()) {
      case "U1":
        return "border-u1";
      case "U2":
        return "border-u2";
      case "U3":
        return "border-u3";
      case "U4":
        return "border-u4";
      case "U5":
        return "border-u5";
      case "U6":
        return "border-u6";
    }
    return ""
  }

  protected getCountdown(nextArrivalTime: Date): number {
    const minutes = ((nextArrivalTime.getTime() - new Date().getTime()) / 1000 / 60);
    if (minutes <= 0) {
      return 0;
    } else if (minutes <= 1) {
      return 1;
    } else {
      return Math.floor(minutes);
    }
  }
}
