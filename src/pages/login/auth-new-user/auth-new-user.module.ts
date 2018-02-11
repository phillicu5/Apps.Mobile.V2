import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthNewUserPage } from './auth-new-user';

@NgModule({
  declarations: [
    AuthNewUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthNewUserPage),
  ],
})
export class AuthNewUserPageModule {}
