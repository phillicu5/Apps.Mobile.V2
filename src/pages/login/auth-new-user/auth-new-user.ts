import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, NavController } from 'ionic-angular';

import { DeviceUserService } from '../../../providers';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';

/**
 * Generated class for the AuthNewUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth-new-user',
  templateUrl: 'auth-new-user.html',
})
export class AuthNewUserPage {

  public loginFormVisible: boolean;
  public authForm: FormGroup;

  /**
   * Creates an instance of AuthNewUserPage.
   */
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private deviceUserService: DeviceUserService) {

    // Build the form
    this.buildForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthNewUserPage');
  }


  public showLoginForm() {
    this.loginFormVisible = true;
  }

  /**
   * Handles the event when the user submits the authentication form.
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
    this.authenticationService.logIn(formData.username, formData.password)
      .subscribe(
        data => {

          // Dismiss the loading spinner
          loading.dismiss();

          // Navigate
          this.navCtrl.setRoot(
            'ChooseSecondaryAuthenticationMethodPage',
            null,
            { animate: true, direction: 'forward' });
        },
        reason => {

          // Clear the password
          this.authForm.patchValue({ password: '' });

          var alert = this.alertCtrl.create({
            title: 'Login Failed',
            subTitle: 'PLease check your details and try again',
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

          alert.present();

          // Dismiss the loading spinner
          loading.dismiss();
        })
  }

  /**
   * Builds the authentication form.
   */
  private buildForm() {
    this.authForm = this.formBuilder.group({
      username: ['phil.worthington@ppsdndv.servo.com', Validators.compose([Validators.required, Validators.minLength(4)])],
      password: ['Monkey123', Validators.required],
    });
  }

  /**
   * Navigates to the Forgotten Password page.
   */
  public navigateToForgottenPasswordPage(): Promise<any> {

    // Push the new page
    var promise = this.navCtrl.push('ForgottenPasswordPage');

    // Return
    return promise;
  }
}
