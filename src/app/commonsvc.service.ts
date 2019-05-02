import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Medicine } from './master-data-tab-module/medicine';
import { Symptom } from './master-data-tab-module/symptom';
import { Appconstants } from './appconstants';

@Injectable({
  providedIn: 'root'
})
export class CommonsvcService {
  baseUrl = Appconstants.baseUrl;
  constructor(private http: HttpClient) {
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        console.error('An error occurred: ', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status},` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later');
  }

  appDataFetch(): any {
    return this.http.get(this.baseUrl + '/api/getAppData')
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadMealData(meals: any[]) {
    return this.http.post(this.baseUrl + '/admin/addMeals', meals)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAppData(obj: any, id: string) {
    return this.http.put(this.baseUrl + '/admin/editAppData/' + id, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  databaseStat() {
    return this.http.get(this.baseUrl + '/admin/dbStats')
      .pipe(
        catchError(this.handleError)
      );
  }

  downloadTemplate(type: string) {
    window.open(this.baseUrl + '/admin/templateDownload/' + type, '_self');
  }

  dropCollections(name: string) {
    return this.http.delete(this.baseUrl + '/admin/deleteCollection/' + name)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadMedicines(meds: Medicine[]) {
    return this.http.post(this.baseUrl + '/admin/addMedicines', meds)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadSymptoms(symptoms: Symptom[]) {
    return this.http.post(this.baseUrl + '/admin/addSymptoms', symptoms)
      .pipe(
        catchError(this.handleError)
      );
  }
}
