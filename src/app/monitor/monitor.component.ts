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
          classes.push("bg-bim");
          break;
        case LineType.WLB:
          classes.push("bg-wlb");
          break;
        case LineType.BUS:
          classes.push("bg-bus");
          break;
        case LineType.NIGHT_LINE:
          classes.push("bg-bus");
          break;
        case LineType.S_LINE:
          classes.push("bg-sb");
          break;
      }
    }
    return classes;
  }

  protected getUndergroundColor(lineName: string | undefined | null): string {
    switch (lineName?.toUpperCase()) {
      case "U1":
        return "bg-u1";
      case "U2":
        return "bg-u2";
      case "U3":
        return "bg-u3";
      case "U4":
        return "bg-u4";
      case "U5":
        return "bg-u5";
      case "U6":
        return "bg-u6";
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
