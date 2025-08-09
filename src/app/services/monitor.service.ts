import {Injectable, signal, Signal} from "@angular/core";
import {Line} from "../../models/line";
import {Monitor} from "../../models/monitor";

@Injectable({
  providedIn: "root"
})
export class MonitorService {
  getMonitor(diva: string, line: Line): Signal<Monitor> {
    return signal<Monitor>({diva: diva, line: line, directions: []}).asReadonly();
  }
}
