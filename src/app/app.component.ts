import {HttpClient} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { TableService } from './services/table.service';

export interface UserData {
  id: string;
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'server-side-table';

  displayedColumns: string[] = ['id', 'name'];
  dataSource!: MatTableDataSource<UserData>;

  data!: Observable<any[]>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageSize = 10;
  currentPage = new BehaviorSubject<number>(1);
  currentPageSize = new BehaviorSubject<number>(this.pageSize);
  currentFilter = new BehaviorSubject<string>("");
  currentSort = new BehaviorSubject<MatSort>({} as MatSort);

  @ViewChild(MatSort, {static: false}) sort: MatSort = {} as MatSort;

  constructor(private tableServ: TableService) { }

  ngOnInit(): void {

    this.data = combineLatest([this.currentSort, this.currentPage, this.currentFilter, this.currentPageSize])
    .pipe(
      // startWith([undefined, ]),
      switchMap(([sortChange, currentPage, currentFilter, pageSize]) => {
        this.isLoadingResults = true;
        return this.tableServ.getNewData(this.sort.active, this.sort.direction, currentPage, currentFilter);
      }),
      map((data: any) => {
        // Flip flag to show that loading has finished.
        data.splice(this.pageSize, data.length)

        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.length;

        return data;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        // Catch if the API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return of([]);
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentFilter.next(filterValue);
  }

  changePage(pageNumber: number): void {
    this.currentPage.next(pageNumber);
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPageSize.next(size);
  }

  applySort(sort: any) {
    this.currentSort.next(sort);
  }

}

