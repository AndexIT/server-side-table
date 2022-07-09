import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient) { }

  getNewData(sort: MatSort, page: {pageIndex: number, pageSize: number}, filter: string): Observable<any> {
    return this.http.get<any>('./assets/mockData.json');
  }
}
