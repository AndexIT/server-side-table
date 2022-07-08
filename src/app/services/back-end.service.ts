import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor() { }
  //=================== Back-End simulato ===================//

  elaborateData(data_NON_SERVE_AL_BD: any, sort: any, currentPage: {pageIndex: number, pageSize: number}, currentFilter: string){

    let filteredData = this.apiFiltro(data_NON_SERVE_AL_BD, currentFilter);

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
    //TODO: fare funzione che filtri effettivamente
    return data;
  }

  apiSort(data: any, sort: any) {
    //TODO: fare funzione che ordini effettivamente

    let sort_active = sort.active;

    let sort_direction = sort.direction;

    return data;
  }
}
