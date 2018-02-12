import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { PasscodeService, TouchIDService } from '../../../providers';
import { PasscodeCompletedEvent } from '../../../ui';
import { DeviceUserService } from './../../../providers/authentication/device-user.service';

/**
 * Generated class for the ChooseSecondaryAuthenticationMethodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-secondary-authentication-method',
  templateUrl: 'choose-secondary-authentication-method.html',
})
export class ChooseSecondaryAuthenticationMethodPage {

  public touchIdIsAvailable: boolean;
  private passcode: string;

  @ViewChild(Slides)
  private slides: Slides;

  /**
   * Creates an instance of ChooseSecondaryAuthenticationMethodPage.
   */
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private deviceUserService: DeviceUserService,
    private passcodeService: PasscodeService,
    private touchIDService: TouchIDService) {
  }

  ionViewDidLoad() {
    // Prevent the user from swiping the slides
    this.slides.onlyExternal = true;

    this.touchIdIsAvailable = this.touchIDService.isAvailable
  }

  /**
   * Enables TouchID and navigates to the Welcome page.
   */
  public enableTouchId() {

    this.deviceUserService.deviceUser.touchID.enabled = true;
    this.deviceUserService.setDeviceUser().subscribe(() => {
      // Navigate
      this.navigateToWelcomePage();
    });
  }

  /**
   * Declines TouchID and offers whether to enable a passcode instead.
   */
  public declineTouchId() {
    this.presentEnablePasscodeAlert();
  }

  /**
   * Presents the alert that asks whether the user would like to choose a passcode as an
   * alternative to TouchID.
   */
  private presentEnablePasscodeAlert() {

    // Create the alert
    var alert = this.alertCtrl.create({
      title: 'Set Up Passcode?',
      subTitle: 'Would you like to set up a passcode to log in with instead?',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.slideToChoosePasscodeSlide();
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
   * Slides to the Choose Passcode slide.
   */
  public slideToChoosePasscodeSlide() {
    this.slides.slideTo(1);
  }


  /**
   * Handles the event when the passcode is completed on the passcode entry where the user choose the passcode.
   */
  public onChoosePasscodeCompleted($event: PasscodeCompletedEvent) {

    // Store the passcode
    this.passcode = $event.passcode;

    // Create an observable that is delayed until the CSS animations have finished
    var observable = Observable.empty()
      .delay(500);

    // Clear the passcode after the delay
    observable.subscribe(
      next => { },
      error => { },
      () => {
        // Notify that the passcode as OK
        $event.source.notifyCorrect();

        // Slide to the next slide
        this.slides.slideNext();
      });
  }

  /**
   * Handles the event when the passcode is completed on the passcode entry where the user confirms the passcode.
   */
  public onConfirmPasscodeCompleted($event: PasscodeCompletedEvent) {

    // Check whether the passcodes match
    if ($event.passcode === this.passcode) {

      this.passcodeService.setPasscode($event.passcode)
        .subscribe(
          data => {
            // Navigatee
            this.navigateToWelcomePage()
          }
        );

    } else {
      // Notify that the passcode wasn't confirmed
      $event.source.notifyIncorrect().subscribe(
        next => { },
        error => { },
        () => {
          // Present the alert
          this.presentIncorrectPasscodeAlert();
        }
      );
    }
  }

  /**
   * Presents the alert that they have enterrd the incorrect passcode when confirming.
   */
  private presentIncorrectPasscodeAlert() {

    // Create the alert
    var alert = this.alertCtrl.create({
      title: 'Incorrect Passcode',
      subTitle: 'The passcode that you entered didn\'t match.',
      buttons: [{
        text: 'Try Again',
        handler: () => {
          // Slide to the previous slide
          this.slides.slideTo(1);
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
  private navigateToWelcomePage() {

    // Push the new page
    var promise = this.navCtrl.setRoot('WelcomePage', null, { animate: true, direction: 'forward' });

    // Return
    return promise;
  }
}
