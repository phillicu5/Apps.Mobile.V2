import { Observable } from 'rxjs';
import { HttpClient, HttpEvent } from '@angular/common/http';

/**
 * Provides a wrapper around standard HTTP client to allow it to be extended.
 */
export class HttpService {

    // The base URL for all requests
    private baseUrl: string;

    /**
     * Creates an instance of httpService.
     */
    constructor(private httpClient: HttpClient) {
    }

    /**
     *  Performs a GET requst to the specified URL.
     */
    get<T>(endpoint: string, params?: any, options?: any): Observable<T> | Observable<HttpEvent<T>> {

        options = options || {};
        options.params = params;

        return this.httpClient.get<T>(this.baseUrl + '/' + endpoint, options);
    }

    /**
     *  Performs a POST requst to the specified URL.
     */
    post<T>(endpoint: string, body: any, options?: any): Observable<T> | Observable<HttpEvent<T>> {
        return this.httpClient.post<T>(this.baseUrl + '/' + endpoint, body, options);
    }

    /**
     *  Performs a PUT requst to the specified URL.
     */
    put<T>(endpoint: string, body: any, options?: any): Observable<T> | Observable<HttpEvent<T>> {
        return this.httpClient.put<T>(this.baseUrl + '/' + endpoint, body, options);
    }

    /**
     *  Performs a DELETE requst to the specified URL.
     */
    delete<T>(endpoint: string, options?: any): Observable<T> | Observable<HttpEvent<T>> {
        return this.httpClient.delete<T>(this.baseUrl + '/' + endpoint, options);
    }

    /**
     *  Performs a PATCH requst to the specified URL.
     */
    patch<T>(endpoint: string, body: any, options?: any): Observable<T> | Observable<HttpEvent<T>> {
        return this.httpClient.put<T>(this.baseUrl + '/' + endpoint, body, options);
    }
}