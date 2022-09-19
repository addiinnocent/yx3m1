import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Config {
  api: {
		api_key: string,
		api_version: number,
	},
	dashboard: {
		maintenance: boolean,
		useragent_protect: string,
		admin_user: string,
		admin_pass: string,
	},
	payment: {
		currency: string,
		stripe_methods: string[],
		stripe_publickey: string,
		stripe_secretkey: string,
		paypal_client: string,
		paypal_secret: string,
	},
	mail: {
		sendmail: boolean,
		mail_from: string,
		mail_host: string,
		mail_port: number,
		mail_secure: boolean,
		mail_user: string,
		mail_pass: string,
	},
  schedules: {
    schedule_email: string,
    schedule_daily: boolean,
    schedule_weekly: boolean,
    schedule_monthly: boolean,
  }
  countries: string[],
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  url = 'api/admin/config.json';

  constructor(
    private http: HttpClient,
  ) { }

  getConfig(): Observable<Config> {
    return this.http.get<Config>(`${this.url}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  putConfig(config: Config): Observable<any> {
    return this.http.put<Config>(`${this.url}`, config)
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
