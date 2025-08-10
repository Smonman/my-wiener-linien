import { AfterViewInit, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MonitorComponent } from "../monitor/monitor.component";
import { MonitorDescriptor } from "../../models/monitor-descriptor";
import { MonitorService } from "../services/monitor.service";
import { ReferenceService } from "../services/reference.service";

@Component({
  selector: "app-dashboard",
  imports: [
    MonitorComponent
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css"
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  protected monitorDescriptors: MonitorDescriptor[] = []
  private referenceService: ReferenceService = inject(ReferenceService);
  private monitorService: MonitorService = inject(MonitorService);

  ngOnInit(): void {
    this.monitorDescriptors.push(this.referenceService.getMonitorDescriptor("60201921", "42"));
    this.monitorDescriptors.push(this.referenceService.getMonitorDescriptor("60201426", "9"));
    this.monitorDescriptors.push(this.referenceService.getMonitorDescriptor("60200874", "U6"));
  }

  ngAfterViewInit(): void {
    this.monitorService.start();
  }

  ngOnDestroy(): void {
    this.monitorService.stop();
  }
}
