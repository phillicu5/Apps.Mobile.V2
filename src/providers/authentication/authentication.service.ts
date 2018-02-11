import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DeviceUser } from '.';
import { Logger, LoggerFactory } from '../../core/';
import { AuthenticateError, AuthenticateErrorReason, OAuthService } from '../api/security/oauth';
import { DeviceUserService } from './device-user.service';
import { PasscodeService } from './passcode.service';

@Injectable()
export class AuthenticationService {

    private logger: Logger;

    /**
     * Creates an instance of AuthenticationService.
     */
    constructor(
        private deviceUserService: DeviceUserService,
        private oAuthService: OAuthService,
        private passcodeService: PasscodeService) {

        // Create the logger
        this.logger = LoggerFactory.create('AuthenticationService');
    }

    /**
     * Authenticates the user based on the credentials provided and sets the user details if the
     * authentication was successful. 
     */
    public logIn(username: string, password: string): Observable<any> {

        // Get the device user (may be null)
        var deviceUser = this.deviceUserService.deviceUser;

        // Authenticate the user using the OAuth service
        var observable = this.oAuthService.authenticate(username, password)
            .catch((err: AuthenticateError | any) => {

                this.logger.debug('Handling failed OAuth authentication.');

                // If error wasn't mapped to a 
                if (!(err instanceof AuthenticateError)) {
                    return Observable.throw(err)
                }

                var authenticateError = err as AuthenticateError

                // Map the error from the OAuth service
                var error: LogInError;

                try {
                    switch (authenticateError.reason) {
                        case AuthenticateErrorReason.InvalidUserCredentials:
                            error = new LogInError(LogInErrorType.InvalidUserCredentials);
                            break;
                        case AuthenticateErrorReason.UserLockedOut:
                            error = new LogInError(LogInErrorType.UserLockedOut);
                            break;
                        default:
                            // For all other types of error just default to a generic error
                            error = new LogInError(LogInErrorType.Error);
                            break;
                    }
                } catch (e) {
                    error = new LogInError(LogInErrorType.Error);
                }

                // Return
                return Observable.throw(error);
            })
            .flatMap(value => {

                this.logger.debug('Setting device user based on result from successfully OAuth authentication.');

                // Create a new device user if a different user has logged in
                if (deviceUser === null || deviceUser.id !== value.user_id) {
                    deviceUser = new DeviceUser();
                    deviceUser.id = value.user_id;
                }

                // Set the user details as they have either never been set or may have changed since the last login
                deviceUser.firstName = value.user_first_name;
                deviceUser.lastName = value.user_last_name;
                deviceUser.emailAddress = username;
                deviceUser.lastLoggedInAt = new Date();

                // Return
                const setObservable = Observable.forkJoin(
                    this.deviceUserService.setNewDeviceUser(deviceUser),
                    this.deviceUserService.setPassword(password));

                // Return
                return setObservable;
            })
            .flatMap(value => {

                this.logger.debug('Unlocking passcode, if required, after successful authentication.');

                var promise: Observable<any>;

                // Unlock the passcode if it is locked
                if (deviceUser.passcode.locked) {
                    promise = this.passcodeService.unlockPasscode();
                } else {
                    promise = Observable.of(value);
                }

                // Return
                return promise;
            });

        // Return
        return observable;
    }

    /**
     * Authenticates the device user based on the credentials provided.
     */
    public logInAsDeviceUser(password: string): Observable<any> {

        var deviceUser = this.deviceUserService.deviceUser;

        // Perform the log-in
        var observable = this.logIn(deviceUser.emailAddress, password);

        // Return
        return observable;
    }

    /**
     * Authenticates the device user based on the credentials previously cached on the device.
     * 
     */
    public logInUsingCachedCredentials(): Observable<any> {

        // Begin by getting the password
        var observable = this.deviceUserService.getPassword()
            .flatMap(password => {

                var deviceUser = this.deviceUserService.deviceUser;

                // Perform the log-in
                var observable = this.logIn(deviceUser.emailAddress, password);

                // Return
                return observable;
            })
            .catch(reason => {

                // If the error is a known error that has cascaded from a previous rejection then
                // use that as the deferred reason, otherwise use a general error
                if (reason instanceof LogInError) {
                    return Observable.throw(reason);
                } else {
                    return Observable.throw(new LogInError(LogInErrorType.Error));
                }
            });

        // Return
        return observable;
    }

    /**
     * Logs the user out of the API and the device.
     */
    public logOut() {
        // TODO
    }
}

/**
 * Defines the error that is returned when a login attempt fails.
 */
export class LogInError {

    /**
     * Creates an instance of LogInError.
     */
    constructor(public type: LogInErrorType) {
    }
}

/**
 * Defines the different types of error that can occur when logging in.
 */
export enum LogInErrorType {
    InvalidUserCredentials,
    UserLockedOut,
    Error
}