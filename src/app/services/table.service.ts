import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private _httpClient: HttpClient) { }

  getNewData(sort: string, order: string, page: number): Observable<any> {
    // return undefined;
    const href = './assets/mockData.json';
    const requestUrl =
        `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;

    return this._httpClient.get<any>(requestUrl);
  }
}
