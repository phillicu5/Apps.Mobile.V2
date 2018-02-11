import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Deferred, Logger, LoggerFactory } from '../core';
import { TouchIDWrapper } from '../core/cordova-wrappers';
import { DeviceUserService } from './authentication/device-user.service';

/**
 * 
 * 
 * @export
 * @class TouchIDService
 */
@Injectable()
export class TouchIDService {

    // Private fields
    private logger: Logger;

    /**
     * Returns a value indicating whether TouchID is available on the device.
     */
    public isAvailable: boolean;

    /**
     * Creates an instance of TouchIDService.
     */
    constructor(
        private deviceUserService: DeviceUserService,
        private touchIDWrapper: TouchIDWrapper) {

        // Create the logger
        this.logger = LoggerFactory.create('TouchIDService');

        // Initialise
        this.initialise();
    }

    /**
     * Initialises the TouchIDService.
     */
    private initialise(): Promise<void> {

        // Check whether TouchID is available 
        var promise = this.touchIDWrapper.isAvailable().then(
            data => {
                this.logger.info('TouchID is available.');

                this.isAvailable = true;
            },
            error => {
                this.logger.info('TouchID is not available', error);

                this.isAvailable = false;
            });

        // Return
        return promise;
    }

    /**
     * Enables TouchID.
     */
    public enableTouchID(): Observable<any> {

        // Get the device user
        var deviceUser = this.deviceUserService.deviceUser;

        // Enable TouchID
        deviceUser.touchID.enabled = true;

        // Set the data in storage
        var observable = this.deviceUserService.setDeviceUser();

        // Return
        return observable;
    }

    /**
     * Disables TouchID.
     */
    public disableTouchID(): Observable<any> {

        // Get the device user
        var deviceUser = this.deviceUserService.deviceUser;

        // Enable TouchID
        deviceUser.touchID.enabled = false;

        // Set the data in storage
        var observable = this.deviceUserService.setDeviceUser();

        // Return
        return observable;
    }

    /**
     * Verifies the fingerprint using TouchID.
     */
    public verifyFingerprint(autoLock: boolean = true): Observable<VerifyTouchIDError> {

        // TODO: Check about didFingerprintDatabaseChange
        // https://github.com/EddyVerbruggen/cordova-plugin-touch-id

        var deferred = new Deferred<VerifyTouchIDError>();

        // Get the device user
        var deviceUser = this.deviceUserService.deviceUser;

        // Check whether TouchID is available
        if (!this.isAvailable) {
            this.logger.warn('Fingerprint verification failed. TouchID is not available.')

            // Return
            return Observable.throw(VerifyTouchIDError.UnavailableOrDisabled);
        }

        // Check if TouchID is enabled
        if (!deviceUser.touchID.enabled) {

            this.logger.warn('Fingerprint verification failed. TouchID is not enabled.')

            // Return
            return Observable.throw(VerifyTouchIDError.UnavailableOrDisabled);
        }

        // Verify the fingerprint
        var promise = this.touchIDWrapper.verifyFingerprint('Scan your fingerprint please');

        // Convert to observable and map any error
        var observable = Observable.fromPromise(promise)
            .do(data => {
                this.logger.info('Fingerprint verification succeeded.');
            })
            .catch(reason => {

                this.logger.warn('Fingerprint verification failed with error code ' + reason + '.');

                // Map the error code and reject the promise
                switch (reason) {
                    case -1:
                        return Observable.throw(VerifyTouchIDError.Failed);
                    case -2:
                    case -4:
                    case -128:
                        return Observable.throw(VerifyTouchIDError.Cancelled);
                    case -6:
                        return Observable.throw(VerifyTouchIDError.UnavailableOrDisabled);
                    default:
                        return Observable.throw(VerifyTouchIDError.Error);
                }
            });;

        // Return
        return observable;
    }
}

/**
 * Defines the different types of error that can occur when attempting to verify a
 * fingerprint using TouchID.
 */
export enum VerifyTouchIDError {
    UnavailableOrDisabled,
    Cancelled,
    Failed,
    Locked,
    Error
}
