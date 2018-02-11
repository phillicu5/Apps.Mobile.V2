import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { DeviceUser } from './device-user';
import { SecureStorageWrapper } from '../../core/cordova-wrappers';
import { Deferred, Logger, LoggerFactory } from '../../core';

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
    public bootstrap(): Promise<any> {

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
        return promise;
    }

    /**
     * Sets the current version of the device user in storage.
     */
    public setDeviceUser(): Promise<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Set the value in storage
        var promise = this.storage.set(DeviceUserStorageKey, this._deviceUser);

        // Return
        return promise;
    }

    /**
     * Sets the current version of the device user in storage.
     */
    public setNewDeviceUser(deviceUser: DeviceUser): Promise<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Set the value in storage
        var promise = this.storage.set(DeviceUserStorageKey, deviceUser)
            .then(() => {
                // Update the local copy
                this._deviceUser = deviceUser;
            });

        // Return
        return promise;
    }

    /**
     * Clears the device user from storage.
     */
    public clearDeviceUser(): Promise<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Clear the value from storage
        var promise = this.storage.remove(DeviceUserStorageKey)
            .then(() => {
                // Clear the local copy
                this._deviceUser = null;
            });;

        // Return
        return promise;
    }

    /**
     * Gets the password from secure storage.
     */
    public getPassword(): Promise<string> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        var deferred = new Deferred<string>();

        // Get the value from secure storage
        this.secureStorageWrapper.get(PasswordStorageKey)
            .then(value => {
                var password = value as string;
                deferred.resolve(password);
            })
            .catch(reason => {
                deferred.resolve(null);
            });

        // Return
        return deferred.promise;
    }

    /**
     * Sets the password in secure storage.
     */
    public setPassword(password: string): Promise<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Set the password in secure storage
        var promise = this.secureStorageWrapper.set(PasswordStorageKey, password);

        // Return
        return promise;
    }

    /**
     * Clears the password from secure storage.
     */
    public clearPassword(): Promise<any> {

        // Ensure that the service has been bootstrapped
        this.ensureBootstrapped();

        // Remove the password from secure storage
        var promise = this.secureStorageWrapper.remove(PasswordStorageKey);

        // Return
        return promise;
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




