import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { Settings } from './index';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicStorageModule
  ],
  providers:[
      Settings
  ]
})
export class ProvidersModule {}
