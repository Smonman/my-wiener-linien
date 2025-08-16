import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MonitorService } from "../services/monitor.service";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-status',
  imports: [
    DatePipe
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit, OnDestroy {
  protected updatedDate: Date = new Date();
  private monitorService: MonitorService = inject(MonitorService);
  private destroySubject: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.monitorService.$update
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        this.updatedDate = new Date();
      });
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
