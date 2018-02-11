import { UIModule } from './../ui/ui.module';
import { WelcomePage } from './../pages/welcome/welcome';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginModule } from '../pages/login/login.module';
import { ProvidersModule } from './../providers/providers.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    LoginModule,
    ProvidersModule,
    UIModule,
    WelcomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
