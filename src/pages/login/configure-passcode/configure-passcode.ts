import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Observable } from 'rxjs';

import { PasscodeService } from '../../../providers';
import { PasscodeCompletedEvent } from '../../../ui';

/**
 * Generated class for the ConfigurePasscodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configure-passcode',
  templateUrl: 'configure-passcode.html',
})
export class ConfigurePasscodePage {

  private passcode: string;

  @ViewChild('slides')
  private slides: Slides;

  /**
   * Creates an instance of ConfigurePasscodePage.
   */
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public passcodeService: PasscodeService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigurePasscodePage');
    this.slides.onlyExternal = true;
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
            // Navigate to the next page
            this.navigateToNextPage()
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
   * Navigates to the next page depending on whether TouchID is available.
   * 
   * @private
   * @returns
   * 
   * @memberOf ConfigurePasscodePage
   */
  private navigateToNextPage() {

    // Navigate to the appropriate page
    const promise = this.navCtrl.setRoot('WelcomePage', null, { animate: true, direction: 'forward' });

    // Return
    return promise;
  }

  /**
   * Presents the alert that they have enterrd the incorrect passcode when confirming.
   * 
   * @private
   * @returns
   * 
   * @memberOf ConfigurePasscodePage
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
   * Skips configuring the passcode and navigates to the next page.
   */
  public skip() {
    return this.navigateToNextPage();
  }
}
