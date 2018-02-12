import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CoreModule } from '../../../core/core.module';
import { UIModule } from '../../../ui/ui.module';
import { ChooseSecondaryAuthenticationMethodPage } from './choose-secondary-authentication-method';

@NgModule({
  declarations: [
    ChooseSecondaryAuthenticationMethodPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseSecondaryAuthenticationMethodPage),
    CoreModule,
    UIModule
  ],
})
export class ChooseSecondaryAuthenticationMethodPageModule { }
