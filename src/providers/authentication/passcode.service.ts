import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Logger, LoggerFactory, SecureStorageWrapper } from '../../core';
import { DeviceUserService } from './device-user.service';

const PasscodeStorageKey: string = 'Passcode';
const MaxFailedAttemptsBeforeLockout: number = 3;

/**
 * Provides functionality relating to passcode authentication on the device.
 * 
 * @export
 * @class PasscodeService
 */
@Injectable()
export class PasscodeService {

    private logger: Logger;

    /**
     * Creates an instance of PasscodeService.
     */
    constructor(
        private platform: Platform,
        private storage: Storage,
        private deviceUserService: DeviceUserService,
        private secureStorageWrapper: SecureStorageWrapper) {

        // Create the logger
        this.logger = LoggerFactory.create('PasscodeService');
    }

    /**
     * Sets the passcode in secure storage.
     */
    public setPasscode(passcode: string): Observable<any> {

        // Store the passcode in secure storage
        var promise = this.secureStorageWrapper.set(PasscodeStorageKey, passcode)
            .flatMap(() => {

                // Get the device user
                var deviceUser = this.deviceUserService.deviceUser;

                // Update the passcode data
                deviceUser.passcode.enabled = true;
                deviceUser.passcode.failedAttempts = 0;
                deviceUser.passcode.locked = false;

                // Set the data in storage
                var promise = this.deviceUserService.setDeviceUser();

                // Return
                return promise;
            })
            .catch(reason => {
                this.logger.error('Failed to set passcode.', reason)

                // Return
                return Observable.throw(reason);
            });

        // Return
        return promise;
    }

    /**
     * Verifies the passcode provided against the passcode stored in secure storage. The passcode will automatically
     * be locked out if too many failed attempts are made in a row.
     */
    public verifyPasscode(passcode: string, autoLock: boolean = true): Observable<any> {

        // Get the device user
        var deviceUser = this.deviceUserService.deviceUser;

        // Check if the passcode is enabled
        if (!deviceUser.passcode.enabled) {

            this.logger.warn('Passcode verification failed. Passcode is not enabled.')

            // Return
            return Observable.throw(VerifyPasscodeError.NotEnabledOrSet);
        }

        // Check if the passcode is locked
        if (deviceUser.passcode.locked) {

            this.logger.warn('Passcode verification failed. Passcode is locked.')

            // Return
            return Observable.throw(VerifyPasscodeError.Locked);
        }

        var verifyPasscodeError: VerifyPasscodeError = null;

        // Get the passcode from secure storage
        var observable = this.secureStorageWrapper.get(PasscodeStorageKey)
            .flatMap(data => {

                this.logger.debug('Got passcode from secure storage.');

                if (data === passcode) {
                    this.logger.info('Passcode matched.');

                    // Reset the number of previous failed attempts
                    deviceUser.passcode.failedAttempts = 0;

                } else {
                    this.logger.warn('Passcode not matched.');

                    // Increment the number of failed attempts
                    deviceUser.passcode.failedAttempts++;

                    // Set the error
                    verifyPasscodeError = VerifyPasscodeError.NotMatched

                    // Lock the passcode if too many failed attempts have been made
                    if (autoLock && deviceUser.passcode.failedAttempts >= MaxFailedAttemptsBeforeLockout) {
                        this.logger.warn('Maximum failed attempts reached. Passcode is now locked.')

                        // Lock the passcode
                        deviceUser.passcode.locked = true;

                        // Set the error
                        verifyPasscodeError = VerifyPasscodeError.NotMatchedLocked
                    }
                }

                // Finally, set the passcode data as it has been updated
                var setObservable = this.deviceUserService.setDeviceUser();

                // Return
                return setObservable;
            })
            .flatMap(data => {
                if (verifyPasscodeError === null) {
                    return Observable.of(data);
                } else {
                    return Observable.throw(verifyPasscodeError);
                }
            })
            .catch(reason => {

                this.logger.warn('Failed to get passcode from secure storage.', reason)

                // Throw
                return Observable.throw(VerifyPasscodeError.NotEnabledOrSet);
            });

        // Return
        return observable;
    }

    /**
     * Unlocks the passcode.
     */
    public unlockPasscode(): Observable<any> {

        // Get the device user
        var deviceUser = this.deviceUserService.deviceUser;

        // Unlock
        deviceUser.passcode.failedAttempts = 0;
        deviceUser.passcode.locked = false;

        // Set the data
        var promise = this.deviceUserService.setDeviceUser();

        // Return
        return promise;
    }

    /**
     * Disables the passcode.
     */
    public disablePasscode(): Observable<any> {

        // Remove the passcode from secure storage
        var observable = this.secureStorageWrapper.remove(PasscodeStorageKey)
            .flatMap(() => {

                // Get the device user
                var deviceUser = this.deviceUserService.deviceUser;

                // Update the passcode data
                deviceUser.passcode.enabled = false;
                deviceUser.passcode.failedAttempts = 0;
                deviceUser.passcode.locked = false;

                // Set the data in storage
                var promise = this.deviceUserService.setDeviceUser();

                // Return
                return promise;
            })
            .catch(reason => {
                this.logger.error('Failed to disable passcode.', reason)

                // Return
                return Observable.throw(reason);
            });

        // Return
        return observable;
    }
}

/**
 * Specifies the different errors that can occur when verifying a passcode.
 */
export enum VerifyPasscodeError {
    NotEnabledOrSet,
    Locked,
    NotMatched,
    NotMatchedLocked
}