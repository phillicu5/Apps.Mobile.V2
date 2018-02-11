import { Injectable } from '@angular/core';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { PluginWrapper } from './plugin.wrapper';

/**
 * Provides a wrapper around the Cordova SecureStorage pluging.
 */
@Injectable()
export class SecureStorageWrapper extends PluginWrapper {

    private isAvailable: boolean;
    private secureStorageObject: SecureStorageObject;
    private fallbackStorageKeyPrefix: string = '__Secure__';

    /**
     * Creates an instance of SecureStorageWrapper.
     */
    constructor(
        platform: Platform,
        private storage: Storage,
        private secureStorage: SecureStorage) {

        // Call the base method
        super(platform, 'SecureStorageWrapper');
    }

    /**
     * Bootstraps the secure storage wrapper. This should only be called after the device is ready.
     */
    public bootstrap(): Observable<any> {

        var promise: Promise<any>;

        // Create the secure storage namespace
        if (this.cordovaAvailable) {
            promise = this.secureStorage.create('nimbl').then(
                (secureStorageObject: SecureStorageObject) => {
                    this.secureStorageObject = secureStorageObject;
                    this.isAvailable = true;
                    this.logger.debug('Secure storage namespace created.');
                },
                error => {
                    this.isAvailable = false;
                    this.logger.error('An error creating secure storage namespace.', error);
                }
            )
        }
        else {
            // If Cordova is not available then the fallback to local storage does not require
            // any bootstrapping so just return a resolved promise
            promise = Promise.resolve();

            this.isAvailable = false;
        }

        // Return
        return Observable.fromPromise(promise);
    }

    /**
     * Gets a value from secure storage.
     */
    public get(reference: string): Observable<any> {

        var promise: Promise<any>;

        if (this.isAvailable) {
            promise = this.secureStorageObject.get(reference);
        } else {
            promise = this.storage.get(this.fallbackStorageKeyPrefix + reference);
        }

        // Return
        return Observable.fromPromise(promise);
    }

    /**
     * Stores a value in secure storage.
     */
    public set(reference: string, value: string): Observable<any> {

        var promise: Promise<any>;

        if (this.isAvailable) {
            promise = this.secureStorageObject.set(reference, value);
        } else {
            promise = this.storage.set(this.fallbackStorageKeyPrefix + reference, value);
        }

        // Return
        return Observable.fromPromise(promise);
    }

    /**
     * Removes a value from secure storage.
     */
    public remove(reference: string): Observable<any> {

        var promise: Promise<any>;

        if (this.isAvailable) {
            promise = this.secureStorageObject.remove(reference);
        } else {
            promise = this.storage.remove(this.fallbackStorageKeyPrefix + reference);
        }

        // Return
        return Observable.fromPromise(promise);
    }
}