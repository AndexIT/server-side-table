//=================== Back-End simulato ===================//
import { Injectable } from '@angular/core';
import { MatSort } from '@angular/material/sort';

export interface UserData {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor() { }

  elaborateData(data /* QUESTO DATA NON VERRA PASSATO AL BD IL QUALE INVECE USERA QUELLO SUO */: UserData[], sort: MatSort, currentPage: {pageIndex: number, pageSize: number}, currentFilter: string){

    let filteredData = this.apiFiltro(data, currentFilter);

    let dataPaginator_and_fullLength = this.apiPaginator(filteredData, currentPage)

    let fullLength = dataPaginator_and_fullLength.fullLength;

    let finalData = this.apiSort(dataPaginator_and_fullLength.data, sort)

    return {finalData: finalData, fullLength: fullLength};
  }

  apiPaginator(data: UserData[], pageData: {pageIndex: number, pageSize: number}){

    let fullLength = data.length;

    if (pageData.pageIndex !== 0) {
      data.splice(0, (pageData.pageIndex * pageData.pageSize))
    }
    data.splice(pageData.pageSize, data.length)

    return {data: data, fullLength: fullLength};
  }

  apiFiltro(data: UserData[], filtro: string) {
    let filteredData = data.filter((el: any) => {
      let res = false;
      for (const key in el) {
        if (Object.prototype.hasOwnProperty.call(el, key)) {
          const property_value = el[key];
          if (property_value.toLowerCase().includes(filtro)) {
            res = true;
          }
        }
      }
      return res;
    })
    return filteredData;
  }

  apiSort(data: UserData[], sort: MatSort) {

    let sort_active = 'id';
    let sort_direction = 'asc';

    if (sort) {
      sort_active = sort.active;
      sort_direction = sort.direction;
    }

    data.sort((a: any, b: any) => {

      if ((isNaN(a[sort_active]))) {

        if (sort_direction === 'asc') {
          return (a[sort_active] > b[sort_active]) ? 1 : ((b[sort_active] > a[sort_active]) ? -1 : 0)
        } else {
          return (a[sort_active] > b[sort_active]) ? -1 : ((b[sort_active] > a[sort_active]) ? 1 : 0)
        }

      } else {

        if (sort_direction === 'asc') {
          return (Number(a[sort_active]) > Number(b[sort_active])) ? 1 : -1;
        } else {
          return (Number(a[sort_active]) > Number(b[sort_active])) ? -1 : 1;
        }

      }

    })

    return data;
  }
}
