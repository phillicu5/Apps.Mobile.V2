import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RefreshError } from '.';
import { Logger, LoggerFactory } from '../../../../core';
import { ConfigService } from './../../../config.service';
import { AuthenticateError, AuthenticateErrorReason } from './authenticate-error';
import { RefreshErrorReason } from './refresh-error';
import { TokenResponseModel } from './token-response-model';

/**
 * Provides functionality for authenticating users against an OAuth token endpoint.
 */
@Injectable()
export class OAuthService {

    // Private fields
    private logger: Logger;

    /**
     * Creates an instance of OAuthService.
     */
    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService) {

        // Create the logger
        this.logger = LoggerFactory.create('OAuthService');
    }

    // #region Public Methods

    /**
     * Authenticates the user against the token endpoint.
     */
    public authenticate(username: string, password: string): Observable<TokenResponseModel> {

        // Create the URL
        var url = this.configService.config.baseApiUrl + '/security/token';

        // Create the form POST data
        var postData = 'grant_type=password' +
            '&client_id=' + encodeURIComponent(this.configService.config.clientId) +
            '&client_secret=' + encodeURIComponent(this.configService.config.clientSecret) +
            '&username=' + encodeURIComponent(username) +
            '&password=' + encodeURIComponent(password);

        // Create the request options
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        };

        // Call the API
        var observable = this.httpClient
            .post<TokenResponseModel>(url, postData, httpOptions)
            .catch(err => this.mapAuthenticateErrorResponse(err));

        // Return
        return observable;
    }

    /**
    * Refreshes the users OAuth token against the token endpoint.
    */
    public refreshToken(token: string): Observable<TokenResponseModel> {

        // Create the URL
        var url = this.configService.config.baseApiUrl + '/security/token';

        // Create the form POST data
        var postData = 'grant_type=refresh_token' +
            '&client_id=' + encodeURIComponent(this.configService.config.clientId) +
            '&client_secret=' + encodeURIComponent(this.configService.config.clientSecret) +
            '&refresh_token=' + encodeURIComponent(token);

        // Create the request options
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        };

        // Make the request
        var observable = this.httpClient
            .post<TokenResponseModel>(url, postData, httpOptions)
            .catch(err => this.mapRefreshErrorResponse(err));

        // Return
        return observable;
    }

    // #endregion

    // #region Error Handling

    /**
     * Attempts to map the error response from the authenticate endpoint to a known error.
     */
    private mapAuthenticateErrorResponse(response: HttpErrorResponse): Observable<any> {

        this.logger.info('OAuth request failed.')

        // Attempt to map known error responses
        if (response.status === 400) {

            // Map the error
            const mappedError = new AuthenticateError();

            switch (response.error.error) {

                case 'invalid_client_credentials':
                    this.logger.warn('Authentication failed due to invalid client credentials.')
                    mappedError.reason = AuthenticateErrorReason.InvalidClientCredentials;
                    break;

                case 'client_disabled':
                    this.logger.warn('Authentication failed due to the client being disabled.')
                    mappedError.reason = AuthenticateErrorReason.ClientDisabled;
                    break;

                case 'invalid_user_credentials':
                    this.logger.warn('Authentication failed due to invalid user credentials.')
                    mappedError.reason = AuthenticateErrorReason.InvalidUserCredentials;
                    break;

                case 'user_locked_out':
                    this.logger.warn('Authentication failed due to the user being locked out.')
                    mappedError.reason = AuthenticateErrorReason.UserLockedOut;
                    break;

                case 'invalid_user_type':
                    this.logger.warn('Authentication failed due to an invalid user type.')
                    mappedError.reason = AuthenticateErrorReason.UserLockedOut;
                    break;

                default:
                    this.logger.warn('Authentication failed due to an unknown error.')
                    mappedError.reason = AuthenticateErrorReason.Error;
                    break;
            }

            // Return with the mapped error
            return Observable.throw(mappedError);
        }

        // Return with the original error
        return Observable.throw(response);
    }

    /**
     * Attempts to map the error response from the refresh endpoint to a known error.
     */
    private mapRefreshErrorResponse(response: HttpErrorResponse): Observable<any> {

        this.logger.info('OAuth request failed.')

        // Attempt to map known error responses
        if (response.status === 400) {

            // Map the error
            const mappedError = new RefreshError();

            switch (response.error.error) {

                case 'invalid_client_credentials':
                    this.logger.warn('Authentication failed due to invalid client credentials.')
                    mappedError.reason = RefreshErrorReason.InvalidClientCredentials;
                    break;

                case 'client_disabled':
                    this.logger.warn('Authentication failed due to the client being disabled.')
                    mappedError.reason = RefreshErrorReason.ClientDisabled;
                    break;

                case 'token_expired':
                    this.logger.warn('Token refresh failed due to the token being expired.')
                    mappedError.reason = RefreshErrorReason.TokenExpired;
                    break;

                case 'invalid_token':
                    this.logger.warn('Token refresh failed due to the token being invalid.')
                    mappedError.reason = RefreshErrorReason.InvalidToken;
                    break;

                case 'invalid_client':
                    this.logger.warn('Token refresh failed due to the client being invalid.')
                    mappedError.reason = RefreshErrorReason.InvalidClient;
                    break;

                case 'user_locked_out':
                    this.logger.warn('Token refresh failed due to the user being locked out.')
                    mappedError.reason = RefreshErrorReason.UserLockedOut;
                    break;

                default:
                    this.logger.warn('Token refresh failed due to an unknown error.')
                    mappedError.reason = RefreshErrorReason.Error;
                    break;
            }

            // Return with the mapped error
            return Observable.throw(mappedError);
        }

        // Return with the original error
        return Observable.throw(response);
    }

    // #endregion
}





