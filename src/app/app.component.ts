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
  currentPage = new BehaviorSubject<{pageIndex: number, pageSize: number}>({pageIndex: 0, pageSize: this.pageSize});
  currentFilter = new BehaviorSubject<string>("");
  currentSort = new BehaviorSubject<MatSort>({} as MatSort);

  @ViewChild(MatSort, {static: false}) sort: MatSort = {} as MatSort;

  constructor(private tableServ: TableService) { }

  ngOnInit(): void {

    this.data = combineLatest([this.currentSort, this.currentPage, this.currentFilter])
    .pipe(
      // startWith([undefined, ]),
      switchMap(([sortChange, currentPage, currentFilter]) => {
        this.isLoadingResults = true;
        return this.tableServ.getNewData(this.sort.active, this.sort.direction, currentPage, currentFilter);
      }),
      map((data: any) => {
        // Flip flag to show that loading has finished.
        this.resultsLength = data.length;

        if (this.currentPage.value.pageIndex !== 0) {
          data.splice(0, (this.currentPage.value.pageIndex * this.currentPage.value.pageSize))
        }
        data.splice(this.pageSize, data.length)

        this.isLoadingResults = false;
        this.isRateLimitReached = false;

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

  changePageSize(page: any) {
    this.pageSize = page.pageSize;
    this.currentPage.next({pageIndex: page.pageIndex, pageSize: page.pageSize});
  }

  applySort(sort: any) {
    this.currentSort.next(sort);
  }

}

