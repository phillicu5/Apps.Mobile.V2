import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { Logger, LoggerFactory } from '../core';

/**
 * Provides functionality for notifying the user of any errors that have occurred.
 */
@Injectable()
export class ErrorNotificationService {

    private _logger: Logger;

    /**
     * Creates an instance of ErrorNotificationService.
     */
    constructor(private _toastCtrl: ToastController) {

        // Create the logger
        this._logger = LoggerFactory.create('ErrorNotificationService');
    }

    /**
     * Presents the error to the UI in the form of a toast.
     */
    public presentError(error: any): Promise<any> {

        // Create the toast
        var toast = this._toastCtrl.create({
            message: error,
            position: 'top',
            cssClass: 'toast-error',
            duration: 3000
        });

        // Present
        var promise = toast.present();

        // Return
        return promise;
    }
}