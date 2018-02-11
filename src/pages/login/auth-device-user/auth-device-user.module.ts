import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthDeviceUserPage } from './auth-device-user';

@NgModule({
  declarations: [
    AuthDeviceUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthDeviceUserPage),
  ],
})
export class AuthDeviceUserPageModule {}
