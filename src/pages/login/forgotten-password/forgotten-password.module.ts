import { UIModule } from './../../../ui/ui.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgottenPasswordPage } from './forgotten-password';

@NgModule({
  declarations: [
    ForgottenPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgottenPasswordPage),
    UIModule
  ],
})
export class ForgottenPasswordPageModule {}
