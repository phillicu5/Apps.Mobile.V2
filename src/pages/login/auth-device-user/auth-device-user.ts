import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AuthDeviceUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth-device-user',
  templateUrl: 'auth-device-user.html',
})
export class AuthDeviceUserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthDeviceUserPage');
  }

  /**
   * Navigate to the detail page for this item.
   */
  navigateToAuthNewUserPage() {
    this.navCtrl.setRoot('AuthNewUserPage');
  }
}
