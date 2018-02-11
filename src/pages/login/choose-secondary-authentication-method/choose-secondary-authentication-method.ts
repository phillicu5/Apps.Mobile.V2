import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseSecondaryAuthenticationMethodPage');
  }

  public navigateToConfigureTouchIdPage() {
    this.navCtrl.push('ConfigureTouchIdPage')
  }

  public navigateToConfigurePasscodePage() {
    this.navCtrl.push('ConfigurePasscodePage')
  }
}
