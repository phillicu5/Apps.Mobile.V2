import { WelcomePage } from './../pages/welcome/welcome';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthNewUserPage, AuthDeviceUserPage } from '../pages/login';
import { Settings } from '../providers/index';

//import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private settings: Settings) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.bootstrap()
        .then(() => {
          console.log(this.settings.current);
          // Determine which page to display first
          if (!this.settings.current.hasViewedWelcomePage) {
            this.rootPage = WelcomePage;
          } else{
            this.rootPage = AuthNewUserPage;
          }

          statusBar.styleDefault();
          splashScreen.hide();
        });





      // Determine which page to go to
      // 1) First open page
      // 2) New user login
      // 3) Previous user login
    });
  }

  /**
   * Bootstraps any providers that need to be initialised in some manner before
   * they can be used.
   */
  private bootstrap(): Promise<any> {
    return Promise.all([
      this.settings.bootstrap(),
    ]);
  }
}

