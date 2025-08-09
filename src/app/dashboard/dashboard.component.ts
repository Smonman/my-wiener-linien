import { Component } from "@angular/core";
import { MonitorComponent } from "../monitor/monitor.component";
import { MonitorRequestDto } from "../../models/monitor";

@Component({
  selector: "app-dashboard",
  imports: [
    MonitorComponent
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css"
})
export class DashboardComponent {
  protected monitors: MonitorRequestDto[] = [
    { diva: "60201921", lineName: "42" },
    { diva: "60201426", lineName: "9" },
    { diva: "60200874", lineName: "U6" },
  ]
}
