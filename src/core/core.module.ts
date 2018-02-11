import { NgModule } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
import { SecureStorage } from '@ionic-native/secure-storage';
import { TouchID } from '@ionic-native/touch-id';
import { Vibration } from '@ionic-native/vibration';
import { IonicStorageModule } from '@ionic/storage';
import { NativeAudioWrapper, SecureStorageWrapper, TouchIDWrapper, VibrationWrapper } from './cordova-wrappers';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicStorageModule
  ],
  providers: [
    NativeAudio,
    NativeAudioWrapper,
    SecureStorage,
    SecureStorageWrapper,
    TouchID,
    TouchIDWrapper,
    Vibration,
    VibrationWrapper
  ]
})
export class CoreModule { }
