import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthNewUserPage');
  }

  authenticate() {
    this.navCtrl.push('ConfigurePasscodePage');


    // Detect 
  }

}
