import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigureTouchIdPage } from './configure-touch-id';

@NgModule({
  declarations: [
    ConfigureTouchIdPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigureTouchIdPage),
  ],
})
export class ConfigureTouchIdPageModule {}
