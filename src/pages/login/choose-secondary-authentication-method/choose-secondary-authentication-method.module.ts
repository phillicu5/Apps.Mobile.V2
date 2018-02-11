import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseSecondaryAuthenticationMethodPage } from './choose-secondary-authentication-method';

@NgModule({
  declarations: [
    ChooseSecondaryAuthenticationMethodPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseSecondaryAuthenticationMethodPage),
  ],
})
export class ChooseSecondaryAuthenticationMethodPageModule {}
