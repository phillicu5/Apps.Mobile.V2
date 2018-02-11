import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

import { AuthDeviceUserPage, AuthNewUserPage } from '../pages/login';
import { Settings } from '../providers';
import { WelcomePage } from './../pages/welcome/welcome';
import { DeviceUserService } from './../providers/authentication/device-user.service';

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
    private settings: Settings,
    private deviceUserService: DeviceUserService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.bootstrap()
        .then(() => {

          // Determine which page to display first
          if (!this.settings.current.hasViewedWelcomePage) {
            this.rootPage = WelcomePage;
          } else {

            const deviceUser = this.deviceUserService.deviceUser;
            if (deviceUser == null) {
              this.rootPage = AuthNewUserPage;
            }
            else {
              this.rootPage = AuthDeviceUserPage;
            }
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
      this.deviceUserService.bootstrap().toPromise()
    ]);
  }
}

