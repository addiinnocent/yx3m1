import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Image {
  _id: string,
  name: string,
  src: string,
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  url = 'api/admin/image.json';

  constructor(
    private http: HttpClient,
  ) { }

  getLength(filter: string): Observable<number> {
    return this.http.get<number>(`${this.url}/length`, {
      params: new HttpParams().set('filter', filter)
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  getImages(
    filter: string,
    pageIndex: number,
    pageSize: number,
  ): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.url}`, {
      params: new HttpParams()
      .set('filter', filter)
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  postImage(formData: FormData): Observable<Image> {
    return this.http.post<Image>(`${this.url}`, formData)
    .pipe(
      catchError(this.handleError)
    );
  }

  changeImage(image: Image, formData: FormData): Observable<Image> {
    return this.http.post<Image>(`${this.url}/${image._id}`, formData)
    .pipe(
      catchError(this.handleError)
    );
  }

  putImage(image: Image): Observable<Image> {
    return this.http.put<Image>(`${this.url}/${image._id}`, image)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteImage(image: Image) {
    return this.http.delete(`${this.url}/${image._id}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
