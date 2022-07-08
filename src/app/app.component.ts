import {HttpClient} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { BackEndService } from './services/back-end.service';
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

  data!: Observable<any>;

  resultsLength = 0;
  isLoadingResults = true;
  pageSize = 10;
  currentPage = new BehaviorSubject<{pageIndex: number, pageSize: number}>({pageIndex: 0, pageSize: this.pageSize});
  currentFilter = new BehaviorSubject<string>("");
  currentSort = new BehaviorSubject<MatSort>({} as MatSort);

  @ViewChild(MatSort, {static: false}) sort: MatSort = {} as MatSort;

  constructor(private tableServ: TableService, private backEnd: BackEndService) { }

  ngOnInit(): void {

    this.data = combineLatest([this.currentSort, this.currentPage, this.currentFilter])
    .pipe(
      switchMap(([sortChange, currentPage, currentFilter]) => {
        this.isLoadingResults = true;
        return this.tableServ.getNewData(this.sort.active, this.sort.direction, currentPage, currentFilter);
      }),
      map((data: any) => {

        let newData = this.backEnd.elaborateData(data, this.sort, this.currentPage.value, this.currentFilter.value)

        this.resultsLength = newData.fullLength;
        this.isLoadingResults = false;

        return newData.finalData;
      }),
      catchError(() => {
        this.isLoadingResults = false;
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

