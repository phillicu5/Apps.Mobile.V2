import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

import { Logger, LoggerFactory } from '../../core';
import { SecureStorageWrapper } from '../../core/cordova-wrappers';
import { DeviceUser } from './device-user';

const DeviceUserStorageKey: string = 'DeviceUser';
const PasswordStorageKey: string = 'Password';

/**
 * Defines the service that manages the details about the user stored on the device.
 */
@Injectable()
export class DeviceUserService {

    // Private fields
    private logger: Logger;
    private isBootstrapped: boolean;
    private _deviceUser: DeviceUser;

    public get deviceUser(): DeviceUser {
        return this._deviceUser;
    }

    /**
     * Creates an instance of DeviceUserService.
     */
    constructor(
        private storage: Storage,
        private secureStorageWrapper: SecureStorageWrapper) {

        // Create the logger
        this.logger = LoggerFactory.create('DeviceUserService');
    }

    /**
     * Bootstraps the service.
     */
    public bootstrap(): Observable<any> {

        this.logger.debug('Bootstrapping.')

        // Get the value from storage
        var promise = this.storage.get(DeviceUserStorageKey)
            .then(value => {
                this._deviceUser = value as DeviceUser;
            })
            .catch(reason => {
                this._deviceUser = null;
            })
            .then(() => {
                this.isBootstrapped = true;
            });

        // Return
        return Observable.fromPromise(promise);
    }

    /**
     * Sets the current version of the device user in storage.
     */
    public setDeviceUser(): Observable<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Set the value in storage
        var promise = this.storage.set(DeviceUserStorageKey, this._deviceUser);

        // Return
        return Observable.fromPromise(promise);
    }

    /**
     * Sets the current version of the device user in storage.
     */
    public setNewDeviceUser(deviceUser: DeviceUser): Observable<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Set the value in storage
        var promise = this.storage.set(DeviceUserStorageKey, deviceUser)
            .then(() => {
                // Update the local copy
                this._deviceUser = deviceUser;
            });

        // Return
        return Observable.fromPromise(promise);
    }

    /**
     * Clears the device user from storage.
     */
    public clearDeviceUser(): Observable<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Clear the value from storage
        var promise = this.storage.remove(DeviceUserStorageKey)
            .then(() => {
                // Clear the local copy
                this._deviceUser = null;
            });;

        // Return
        return Observable.fromPromise(promise);
    }

    /**
     * Gets the password from secure storage.
     */
    public getPassword(): Observable<string> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Get the value from secure storage
        var observable = this.secureStorageWrapper.get(PasswordStorageKey)
            .flatMap(value => {
                var password = value as string;
                return Observable.of(password);
            })
            .catch(reason => {
                return Observable.throw(reason);
            });

        // Return
        return observable;
    }

    /**
     * Sets the password in secure storage.
     */
    public setPassword(password: string): Observable<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Set the password in secure storage
        var observable = this.secureStorageWrapper.set(PasswordStorageKey, password);

        // Return
        return observable;
    }

    /**
     * Clears the password from secure storage.
     */
    public clearPassword(): Observable<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Remove the password from secure storage
        var observable = this.secureStorageWrapper.remove(PasswordStorageKey);

        // Return
        return observable;
    }

    /**
     * Ensures that the service has been bootstrapped.
     */
    private ensureBootstrapped() {

        // Throw an exception if the service hasn't been bootstrapped yet
        if (!this.isBootstrapped) {
            throw 'DeviceUserService cannot be used before it has been bootstrapped.';
        }
    }
}




