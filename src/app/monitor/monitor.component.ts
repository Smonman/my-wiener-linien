import {Component, computed, inject, input, InputSignal, Signal} from "@angular/core";
import {LineService} from "../services/line.service";
import {UpperCasePipe} from "@angular/common";
import {MonitorService} from "../services/monitor.service";
import {Monitor} from "../../models/monitor";
import {Line} from "../../models/line";

@Component({
  selector: "app-monitor",
  imports: [UpperCasePipe],
  templateUrl: "./monitor.component.html",
  styleUrl: "./monitor.component.css"
})
export class MonitorComponent {
  readonly diva: InputSignal<string> = input.required<string>();
  readonly lineName: InputSignal<string> = input.required<string>();
  private lineService: LineService = inject(LineService);
  protected lineSignal: Signal<Line> = computed(() => this.lineService.getLineFromName(this.lineName()));
  private monitorService: MonitorService = inject(MonitorService);
  protected monitorSignal: Signal<Monitor> = computed(() => this.monitorService.getMonitor(this.diva(), this.lineSignal())());
}
