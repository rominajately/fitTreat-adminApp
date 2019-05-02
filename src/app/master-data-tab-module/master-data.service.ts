import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Meal } from './meal';
import { Medicine } from './medicine';
import { Symptom } from './symptom';
import { Appconstants } from '../appconstants';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  baseUrl = Appconstants.baseUrl;
  constructor(private http: HttpClient) {
  }
  /* Error Handler */
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

  /* Method to fetch all the medicines */
  getAllMedicines(): Observable<Medicine[]> {
    return this.http
      .get<Medicine[]>(this.baseUrl + '/admin/getAllMeds')
      .pipe(catchError(this.handleError));
  }

  /* Method to add medicines */

  postMedicines(meds: any[]) {
    return this.http
      .post(this.baseUrl + '/admin/addMedicines', meds)
      .pipe(catchError(this.handleError));
  }

  /* Method to add new medicine */

  addNewMedicine(med: Medicine): any {
    return this.http
      .post(this.baseUrl + '/admin/addNewMedicine', med)
      .pipe(catchError(this.handleError));
  }

  /* Method to delete medicines */

  deleteMedicines(ids: string[]) {
    return this.http
      .post(this.baseUrl + '/admin/deleteMeds', ids)
      .pipe(catchError(this.handleError));
  }

  /* Method to update existing medicine */

  updateMedicine(med: Medicine, id: string) {
    return this.http
      .put(this.baseUrl + '/updateMedicine/' + id, med)
      .pipe(catchError(this.handleError));
  }

  /* Method to fetch all the symptoms */

  getAllSymptoms(): Observable<Symptom[]> {
    return this.http
      .get<Symptom[]>(this.baseUrl + '/admin/getAllSymptoms')
      .pipe(catchError(this.handleError));
  }

  /* Method to delete symptoms */

  deleteSymptoms(ids: string[]) {
    return this.http
      .post(this.baseUrl + '/admin/deleteSymptoms', ids)
      .pipe(catchError(this.handleError));
  }

  /* Method to add new symptom */

  addNewSymtom(symptom: Symptom): any {
    return this.http
      .post(this.baseUrl + '/admin/addNewSymptom', symptom)
      .pipe(catchError(this.handleError));
  }

  /* Method to update existing symptom */

  updateSymptom(symp: Symptom, id: string) {
    return this.http
      .put(this.baseUrl + '/updateSymptom/' + id, symp)
      .pipe(catchError(this.handleError));
  }

  /* Method to fetch list of meals */

  /*   getMealsList(skip:number,top:number): Observable<Meal[]> {
    return this.http.get<Meal[]>(this.baseUrl+'/admin/getMealsList/'+skip+'/'+top)
      .pipe(catchError(this.handleError));
  } */

  getMealsList(skip: number, top: number): Observable<Meal[]> {
    return this.http
      .get<Meal[]>(this.baseUrl + '/admin/getMealsList')
      .pipe(catchError(this.handleError));
  }

  /* Add Meals */

  addNewMeal(meal: Meal) {
    return this.http
      .post(this.baseUrl + '/admin/addNewMeal', meal)
      .pipe(catchError(this.handleError));
  }

  updateMeal(meal: Meal) {
    return this.http
      .put(this.baseUrl + '/admin/updateMeal/' + meal._id, meal)
      .pipe(catchError(this.handleError));
  }

  deleteMeal(mealId: string) {
    return this.http
      .delete(this.baseUrl + '/admin/deleteMeal/' + mealId)
      .pipe(catchError(this.handleError));
  }
}
