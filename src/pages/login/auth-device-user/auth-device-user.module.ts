import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CoreModule } from '../../../core/core.module';
import { UIModule } from '../../../ui/ui.module';
import { AuthDeviceUserPage } from './auth-device-user';

@NgModule({
  declarations: [
    AuthDeviceUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthDeviceUserPage),
    CoreModule,
    UIModule
  ],
})
export class AuthDeviceUserPageModule { }
