import { HttpClient } from '@angular/common/http';

/**
 * Provides a wrapper around standard HTTP client to allow it to be extended.
 */
export class httpService {

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
    get(endpoint: string, params?: any, options?: any) {

        options = options || {};
        options.params = params;

        return this.httpClient.get(this.baseUrl + '/' + endpoint, options);
    }

    /**
     *  Performs a POST requst to the specified URL.
     */
    post(endpoint: string, body: any, options?: any) {
        return this.httpClient.post(this.baseUrl + '/' + endpoint, body, options);
    }

    /**
     *  Performs a PUT requst to the specified URL.
     */
    put(endpoint: string, body: any, options?: any) {
        return this.httpClient.put(this.baseUrl + '/' + endpoint, body, options);
    }

    /**
     *  Performs a DELETE requst to the specified URL.
     */
    delete(endpoint: string, options?: any) {
        return this.httpClient.delete(this.baseUrl + '/' + endpoint, options);
    }

    /**
     *  Performs a PATCH requst to the specified URL.
     */
    patch(endpoint: string, body: any, options?: any) {
        return this.httpClient.put(this.baseUrl + '/' + endpoint, body, options);
    }
}