import { Injectable } from '@angular/core';
import { MonitorDescriptor } from "../../models/monitor-descriptor";

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  private monitorDescriptors: Map<string, MonitorDescriptor> = new Map<string, MonitorDescriptor>();

  /**
   * Returns the specific monitor descriptor for the given values.
   * <p>
   * For equal values, the same descriptor object will be returned.
   *
   * @param diva the diva of the descriptor
   * @param line the line name of the descriptor
   */
  getMonitorDescriptor(diva: string, line: string): MonitorDescriptor {
    const monitorDescriptorString: string = this.getMonitorDescriptorString(diva, line);
    if (!this.monitorDescriptors.has(monitorDescriptorString)) {
      this.monitorDescriptors.set(monitorDescriptorString, { diva: diva, line: line });
    }
    return this.monitorDescriptors.get(monitorDescriptorString)!;
  }

  private getMonitorDescriptorString(diva: string, line: string) {
    return `${diva}:${line}`;
  }
}
