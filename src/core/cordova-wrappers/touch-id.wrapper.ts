import { Injectable } from '@angular/core';
import { ActionSheetController, Platform } from 'ionic-angular';
import { TouchID } from '@ionic-native/touch-id';

import { Deferred } from '../deferred';
import { PluginWrapper } from './plugin.wrapper';

/**
 * Provides a wrapper around the Cordova TouchID plugin to support mocking fingerprint verification
 * when running in a browser.
 * 
 * @export
 * @class TouchIDWrapper
 */
@Injectable()
export class TouchIDWrapper extends PluginWrapper {

    /**
     * Creates an instance of TouchIDWrapper.
     */
    constructor(
        platform: Platform,
        private actionSheetCtrl: ActionSheetController,
        private touchId: TouchID) {

        // Call the base method
        super(platform, 'TouchIDWrapper');
    }

    /**
     * Checks Whether TouchID is available or not.
     */
    public isAvailable(): Promise<any> {
        if (this.cordovaAvailable) {
            return this.touchId.isAvailable();
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * Show TouchID dialog and wait for a fingerprint scan. If user taps 'Enter Password' button,
     * brings up standard system passcode screen.
     * 
     * Returns a Promise that either resolves if the fingerprint scan was successful,
     * or rejects with an error code (see above).
     */
    public verifyFingerprint(message: string): Promise<any> {

        var promise: Promise<any>;

        // Perform the appropriate verification
        if (this.cordovaAvailable) {
            promise = this.touchId.verifyFingerprint(message);
        } else {
            promise = this.mockVerifyFingerprint();
        }

        // Handle error
        promise.catch(reason => {
            this.logger.error('An error occurred verifying the fingerprint.', reason);
        });

        // Return
        return promise;
    }

    /**
     * Provides a mock implementation of fingerprint verification by displaying an action that allows
     * the user to choose any of the responses that my be returned from a native fingerprint verification.
     */
    private mockVerifyFingerprint(): Promise<any> {

        // Create a deferred promise to handle the result of action sheet
        var deferred = new Deferred();

        let actionSheet = this.actionSheetCtrl.create({
            title: 'Verify Fingerprint',
            buttons: [
                {
                    text: 'Verify',
                    handler: () => {
                        deferred.resolve();
                    }
                }, {
                    text: 'Failed',
                    role: 'destructive',
                    handler: () => {
                        deferred.reject(-1);
                    }
                }, {
                    text: 'Enter Password/Password',
                    role: 'destructive',
                    handler: () => {
                        deferred.reject(-3);
                    }
                }, {
                    text: 'Not Available',
                    role: 'destructive',
                    handler: () => {
                        deferred.reject(-6);
                    }
                }, {
                    text: 'Locked',
                    role: 'destructive',
                    handler: () => {
                        deferred.reject(-6);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        deferred.reject(-2);
                    }
                }
            ]
        });

        // Present the action sheet
        actionSheet.present();

        // Return
        return deferred.promise;
    }
}