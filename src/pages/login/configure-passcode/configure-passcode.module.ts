import { CoreModule } from './../../../core/core.module';
import { UIModule } from './../../../ui/ui.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigurePasscodePage } from './configure-passcode';

@NgModule({
  declarations: [
    ConfigurePasscodePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigurePasscodePage),
    CoreModule,
    UIModule
  ],
})
export class ConfigurePasscodePageModule {}
