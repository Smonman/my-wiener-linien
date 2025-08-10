import { Component, inject, input, InputSignal, OnDestroy, OnInit, Signal } from "@angular/core";
import { JsonPipe, UpperCasePipe } from "@angular/common";
import { MonitorService } from "../services/monitor.service";
import { Monitor } from "../../models/monitor";
import { MonitorDescriptor } from "../../models/monitor-descriptor";

@Component({
  selector: "app-monitor",
  imports: [UpperCasePipe, JsonPipe],
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
}
