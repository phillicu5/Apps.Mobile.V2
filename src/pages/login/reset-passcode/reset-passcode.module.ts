import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPasscodePage } from './reset-passcode';

@NgModule({
  declarations: [
    ResetPasscodePage,
  ],
  imports: [
    IonicPageModule.forChild(ResetPasscodePage),
  ],
})
export class ResetPasscodePageModule {}
