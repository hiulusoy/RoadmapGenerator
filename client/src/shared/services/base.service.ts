import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environement';
import { map } from 'rxjs/operators';

export class BaseService {
  protected _baseUrl: string = environment._baseUrl;
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  protected get<T>(endPoint: string): Observable<T> {
    const options = this.InitHeader();
    const url: string = this._baseUrl + endPoint;
    return this._http.get<{ data: T }>(url, { headers: options }).pipe(
      map((response) => response.data) // Sadece `data` alanını döndür
    );
  }

  protected delete<T>(endPoint: string): Observable<T> {
    const options = this.InitHeader();
    const url: string = this._baseUrl + endPoint;
    return this._http.delete<{ data: T }>(url, { headers: options }).pipe(
      map((response) => response.data) // Sadece `data` alanını döndür
    );
  }

  protected post<T, U>(endPoint: string, request: U | string): Observable<T> {
    const options = this.InitHeader();
    const url: string = this._baseUrl + endPoint;
    return this._http.post<{ data: T }>(url, request, { headers: options }).pipe(
      map((response) => response.data) // Sadece `data` alanını döndür
    );
  }

  protected put<T, U>(endPoint: string, request: U | string): Observable<T> {
    const options = this.InitHeader();
    const url: string = this._baseUrl + endPoint;
    return this._http.put<{ data: T }>(url, request, { headers: options }).pipe(
      map((response) => response.data) // Sadece `data` alanını döndür
    );
  }

  protected getBlob(endPoint: string): Observable<any> {
    const requestOptions: any = {
      headers: new HttpHeaders().append('Accept', '*/*').append('Accept-Language', 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'),
      responseType: 'blob',
    };
    const url: string = this._baseUrl + endPoint;
    return this._http.get<any>(url, requestOptions);
  }

  protected upload<T>(endPoint: string, request: any): Observable<T> {
    const url: string = this._baseUrl + endPoint;
    return this._http.post<{ data: T }>(url, request, {}).pipe(
      map((response) => response.data) // Sadece `data` alanını döndür
    );
  }

  private InitHeader(): HttpHeaders {
    const headers = new HttpHeaders().append('Content-Type', 'application/json').append('Accept', '*/*').append('Accept-Language', 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7');

    return headers;
  }
}
