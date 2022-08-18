import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { Candidat } from '../models/candidat.model';
// import { Observable, of } from 'rxjs';
import { CandidatsService } from '../services/candidats.service';

@Component({
  selector: 'prh-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss'],
})
export class InterviewsComponent implements OnInit, OnDestroy {
  public candidats: Candidat[] = [];

  public offset: number = 0;
  public limit: number = 10;
  public total: number = 0;
  public page: number = 1;

  private destroy$: Subject<void> = new Subject();

  public get lastPage(): number {
    return Math.ceil(this.total / this.limit);
  }

  constructor(private candidatsService: CandidatsService) {}

  ngOnInit(): void {
    this.getCandidats();
  }

  public getCandidats() {
    this.candidatsService
      .getCandidat$()
      .pipe(
        map((candidats: Candidat[]) => (this.candidats = candidats)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        complete: () => {
          console.log('Jai fini');
        },
      });
  }

  private changeOffset() {
    this.offset = (this.page - 1) * this.limit;
  }

  public changePage(_page: number) {
    this.page = _page;
    this.changeOffset();
    this.getCandidats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
