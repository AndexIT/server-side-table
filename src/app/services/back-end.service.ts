//=================== Back-End simulato ===================//
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor() { }

  elaborateData(data /* QUESTO DATA NON VERRA PASSATO AL BD IL QUALE INVECE USERA QUELLO SUO */: any, sort: any, currentPage: {pageIndex: number, pageSize: number}, currentFilter: string){

    let filteredData = this.apiFiltro(data, currentFilter);

    let dataPaginator_and_fullLength = this.apiPaginator(filteredData, currentPage)

    let fullLength = dataPaginator_and_fullLength.fullLength;

    let finalData = this.apiSort(dataPaginator_and_fullLength.data, sort)

    return {finalData: finalData, fullLength: fullLength};
  }

  apiPaginator(data: any, pageData: {pageIndex: number, pageSize: number}){

    let fullLength = data.length;

    if (pageData.pageIndex !== 0) {
      data.splice(0, (pageData.pageIndex * pageData.pageSize))
    }
    data.splice(pageData.pageSize, data.length)

    return {data: data, fullLength: fullLength};
  }

  apiFiltro(data: any, filtro: string) {
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

  apiSort(data: any, sort: any) {

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
