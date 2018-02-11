import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../providers';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settings: Settings) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  /**
   * Navigate to the signup page.
   */
  public navigateToSignupPage() {
    this.navCtrl.push('SignupPage');
  }

  /**
   * Navigate to the auth new user page.
   */
  public navigateToAuthNewUserPage() {
    this.settings.current.hasViewedWelcomePage = true;
    this.settings.save();
    this.navCtrl.push('AuthNewUserPage');
  }
}
