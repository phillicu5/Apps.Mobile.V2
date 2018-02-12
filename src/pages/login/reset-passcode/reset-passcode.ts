import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, Slides } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { PasscodeService } from '../../../providers';
import { PasscodeCompletedEvent } from '../../../ui';

/**
 * Generated class for the ResetPasscodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-passcode',
  templateUrl: 'reset-passcode.html',
})
export class ResetPasscodePage {

  private passcode: string;

  @ViewChild(Slides)
  private slides: Slides;

  /**
   * Creates an instance of ResetPasscodePage.
   */
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private passcodeService: PasscodeService) { }

  /**
   * Called when the view is first initialised.
   */
  ngAfterViewInit() {

    // Prevent the user from swiping the slides
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
  onConfirmPasscodeCompleted($event: PasscodeCompletedEvent) {

    // Check whether the passcode match
    if ($event.passcode === this.passcode) {

      // Set the passcode
      this.passcodeService.setPasscode($event.passcode).subscribe(
        data => {
          // Slide to the next slide
          this.slides.slideNext();
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
   * Handles the user skipping resetting their a passcode.
   */
  public onSkip() {

    // Navigate
    this.navigateToWelcomePage();
  }

  /**
   * Navigates to the Welcome page.
   */
  private navigateToWelcomePage() {

    // Push the new page
    var promise = this.navCtrl.setRoot(
      'WelcomePage',
      null,
      {
        animate: true,
        direction: 'forward'
      });

    // Return
    return promise;
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
          this.slides.slidePrev();
        }
      }]
    });

    // Present the alert
    var promise = alert.present();

    // Return
    return promise;
  }
}
