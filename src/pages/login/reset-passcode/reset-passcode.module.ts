import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CoreModule } from '../../../core/core.module';
import { UIModule } from '../../../ui/ui.module';
import { ResetPasscodePage } from './reset-passcode';

@NgModule({
  declarations: [
    ResetPasscodePage,
  ],
  imports: [
    IonicPageModule.forChild(ResetPasscodePage),
    CoreModule,
    UIModule
  ],
})
export class ResetPasscodePageModule { }
