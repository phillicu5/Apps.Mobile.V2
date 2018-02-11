import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';

import { ErrorNotificationService, Settings } from '.';
import { OAuthService } from './api/security/oauth/oauth.service';
import { AuthenticationService } from './authentication/authentication.service';
import { DeviceUserService } from './authentication/device-user.service';
import { PasscodeService } from './authentication/passcode.service';
import { Config } from './config';
import { ConfigService } from './config.service';
import { TouchIDService } from './touch-id.service';

@NgModule({
  declarations: [
  ],
  imports: [
    HttpClientModule,
    IonicStorageModule
  ],
  providers: [
    AuthenticationService,
    Config,
    ConfigService,
    DeviceUserService,
    ErrorNotificationService,
    OAuthService,
    PasscodeService,
    Settings,
    TouchIDService
  ]
})
export class ProvidersModule { }
