import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Logger, LoggerFactory } from '../../../core';
import {
  DeviceUser,
  DeviceUserService,
  ErrorNotificationService,
  PasscodeService,
  TouchIDService,
  VerifyPasscodeError,
} from '../../../providers';
import { AuthenticationService, LogInError, LogInErrorType } from '../../../providers/authentication/authentication.service';
import { PasscodeCompletedEvent } from '../../../ui';

@Component({
  selector: 'page-auth-device-user',
  templateUrl: 'auth-device-user.html',
  host: {
    'class': 'palette-purple-rain'
  }
})
export class AuthDeviceUserPage {

  // Private fields
  private logger: Logger;
  private viewDidEnter: boolean;
  private passcodeLocked: boolean;

  public authForm: FormGroup;
  public state: string = 'passcode';
  public deviceUser: DeviceUser;

  /**
   * Creates an instance of AuthDeviceUserPage.
   */
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private errorNotificationService: ErrorNotificationService,
    private authenticationService: AuthenticationService,
    private deviceUserService: DeviceUserService,
    private passcodeService: PasscodeService,
    private touchIDService: TouchIDService) {

    // Create the logger
    this.logger = LoggerFactory.create('AuthDeviceUserPage');

    // Build the form
    this.buildForm();

    // Get the device user
    this.deviceUser = this.deviceUserService.deviceUser;
    this.passcodeLocked = this.deviceUser.passcode.locked;

    // Determine which state the page should be in
    if (!this.deviceUser.passcode.enabled || this.deviceUser.passcode.locked) {
      this.logger.debug('Passcode not enabled');
      this.state = 'password';
    } else {
      this.logger.debug('Passcode enabled');
      this.state = 'passcode';
    }
  }

  /**
   * Handles the event when the when the view has become active.
   */
  public ionViewDidEnter() {

    // Exit if the view has already been entered (i.e. we're navigating back)
    if (this.viewDidEnter) {
      return;
    }

    // Flag that the view has been entered
    this.viewDidEnter = true;

    // Verify the fingerprint if applicable
    this.verifyFingerprint();
  }

  /**
   * Handles the event when the passcode is completed on the passcode entry.
   */
  public onPasscodeCompleted($event: PasscodeCompletedEvent) {

    // Check the passcode
    this.passcodeService.verifyPasscode($event.passcode)
      .subscribe(
        data => {

          // Notify the passcode entry that the passcode was correct
          $event.source.notifyCorrect();

          // Authenticate
          this.authenticateUsingCachedCredentials();
        },
        reason => {

          // Notify the passcode entry that the passcode was incorrect
          $event.source.notifyIncorrect();

          var passcodeError = reason as VerifyPasscodeError;

          switch (passcodeError) {
            case VerifyPasscodeError.NotEnabledOrSet:
            case VerifyPasscodeError.NotMatchedLocked:
            case VerifyPasscodeError.Locked:

              // Flag that the passcode has been locked
              this.passcodeLocked = true;

              // Present the alert
              this.presentPasscodeLockedAlert();
              break;

            default:
              break;
          }
        });
  }

  /**
   * Triggers TouchID to verify the fingerprint of the user. 
   */
  public verifyFingerprint() {

    // Exit if TouchID isn't available
    if (!this.touchIDService.isAvailable) {
      return;
    }

    // Exit if TouchID isn't enabled
    if (!this.deviceUser.touchID.enabled) {
      return;
    }

    // Verify the fingerprint
    this.touchIDService.verifyFingerprint()
      .subscribe(
        data => {
          return this.authenticateUsingCachedCredentials();
        },
        reason => {
          // If error occurred with TouchID then prompt the user to enter their password

          return Observable.throw(reason)
        });
  }

  /**
   * Authenticates the user using the credentials that were previously cached.
   */
  private authenticateUsingCachedCredentials() {

    this.logger.debug('Authenticating the user using cached credentials');

    // Show loading spinner
    var loading = this.loadingCtrl.create({
      content: 'Authenticating'
    });
    loading.present();

    // Authenticate the user
    this.authenticationService.logInUsingCachedCredentials()
      .subscribe(
        data => {

          this.logger.info('Authentication succeeded.');

          // Dismiss the loading spinner
          loading.dismiss();

          // Navigate
          this.navigateToWelcomePage();
        },
        reason => {

          this.logger.warn('Authentication failed.', reason);

          // Dismiss the loading spinner
          loading.dismiss();

          var error = reason as LogInError;

          switch (error.type) {

            case LogInErrorType.InvalidUserCredentials:
              this.presentIncorrectCachedPasswordAlert();
              break;

            case LogInErrorType.UserLockedOut:
              // TODO: Show error
              break;

            case LogInErrorType.Error:
            default:
              // TODO: Show general error
              break;
          }
        });
  }

  /**
   * Switches the page to be in the password state.
   */
  public switchToPasswordState() {
    this.state = 'password';
  }

  /**
   * Builds the form.
   */
  private buildForm() {
    this.authForm = this.formBuilder.group({
      password: ['Monkey111', Validators.required],
    });
  }

  /**
   * Handles the form being submitted.
   */
  public onSubmit(formData) {

    // Exit if the form isn't valid
    if (!this.authForm.valid) {
      return;
    }

    // Show loading spinner
    var loading = this.loadingCtrl.create({
      content: 'Authenticating'
    });
    loading.present();

    // Perform the log in
    this.authenticationService.logInAsDeviceUser(formData.password)
      .subscribe(
        data => {
          // Dismiss the loading spinner
          loading.dismiss()
            .then(() => {
              // Navigate
              if (this.passcodeLocked) {
                this.presentResetPasscodeAlert();
              } else {
                this.navigateToWelcomePage();
              }
            });
        },
        reason => {
          // Clear the password
          this.authForm.patchValue({ password: '' });

          // Dismiss the loading spinner
          loading.dismiss();

          // Present the alert
          this.presentIncorrectPasswordAlert();
        });
  }

  /**
   * Present the alert that informs the user that their passcode has been locked.
   */
  private presentPasscodeLockedAlert() {

    // Create the alert
    var alert = this.alertCtrl.create({
      title: 'Passcode Locked',
      subTitle: 'Log in with your password to unlock your passcode.',
      buttons: [{
        text: 'Enter Password',
        handler: () => {
          this.state = 'password';
        }
      }]
    });

    // Present the alert
    var promise = alert.present();

    // Return
    return promise;
  }

  /**
   * Presents the alert that informs the user that they have entered their password incorrectly.
   */
  private presentIncorrectPasswordAlert() {

    // Create the alert
    var alert = this.alertCtrl.create({
      title: 'Login Failed',
      subTitle: 'Please check your password and try again.',
      buttons: [
        // Try again
        {
          text: 'Try Again'
        },
        // Forgotten password
        {
          text: 'Forgotten Password?',
          handler: () => {
            this.navigateToForgottenPasswordPage();
          }
        }]
    });

    // Present the alert
    var promise = alert.present();

    // Return
    return promise;
  }

  /**
   * Presents the alert that informs the user that they have entered their password incorrectly.
   */
  private presentIncorrectCachedPasswordAlert() {

    // Create the alert
    var alert = this.alertCtrl.create({
      title: 'Login Failed',
      subTitle: 'Please re-enter your password and try again.',
      buttons: [{
        text: 'Enter Password',
        handler: () => {
          this.state = 'password';
        }
      }]
    });

    // Present the alert
    var promise = alert.present();

    // Return
    return promise;
  }

  /**
   * Presents the alert that asks the user whether they would like to reset their password.
   */
  private presentResetPasscodeAlert() {

    // Create the alert
    var alert = this.alertCtrl.create({
      title: 'Choose new passcode',
      subTitle: 'Would you like to choose a new passcode?',
      buttons: [{
        text: 'Choose New Passcode',
        handler: () => {
          this.navigateToResetPasscodePage();
        }
      }, {
        text: 'No Thanks',
        role: 'cancel',
        handler: () => {
          this.navigateToWelcomePage();
        }
      }]
    });

    // Present the alert
    var promise = alert.present();

    // Return
    return promise;
  }

  /**
   * Navigates to the Welcome page.
   */
  public logInAsDifferentUser() {

    // Create the alert
    var alert = this.alertCtrl.create({
      title: 'Log in as Different User',
      subTitle: 'Don\'t forget that you\'ll need to log back in again to keep receiving your notifications.',
      buttons: [{
        text: 'Continue',
        handler: () => {
          // Clear the current user
          this.deviceUserService.clearDeviceUser()
            .subscribe(value => {
              // Navigate
              this.navigateToStartPage();
            });
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    });

    // Present the alert
    var promise = alert.present();

    // Return
    return promise;
  }

  // #region Page Navigation

  /**
   * Navigates to the Start page.
   */
  private navigateToStartPage() {

    // Push the new page
    var promise = this.navCtrl.setRoot('StartPage', null, { animate: true, direction: 'backward' });

    // Return
    return promise;
  }

  /**
   * Navigates to the Welcome page.
   */
  private navigateToWelcomePage() {

    // Push the new page
    var promise = this.navCtrl.setRoot('WelcomePage', null, { animate: true, direction: 'forward' });

    // Return
    return promise;
  }

  /**
   * Navigates to the Forgotten Password page.
   */
  private navigateToForgottenPasswordPage() {

    // Push the new page
    var promise = this.navCtrl.push('ForgottenPasswordPage');

    // Return
    return promise;
  }

  /**
   * Navigates to the Reset Passcode page.
   */
  private navigateToResetPasscodePage() {

    // Push the new page
    var promise = this.navCtrl.setRoot('ResetPasscodePage', null, { animate: true, direction: 'forward' });

    // Return
    return promise;
  }

  // #endregion
}
