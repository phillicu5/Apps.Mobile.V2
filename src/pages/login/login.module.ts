import { NgModule } from '@angular/core';

import { CoreModule } from './../../core/core.module';
import { UIModule } from './../../ui/ui.module';
import { AuthDeviceUserPageModule } from './auth-device-user/auth-device-user.module';
import { AuthNewUserPageModule } from './auth-new-user/auth-new-user.module';
import { ConfigurePasscodePageModule } from './configure-passcode/configure-passcode.module';
import { ConfigureTouchIdPageModule } from './configure-touch-id/configure-touch-id.module';
import { ForgottenPasswordPageModule } from './forgotten-password/forgotten-password.module';
import { ResetPasscodePageModule } from './reset-passcode/reset-passcode.module';

@NgModule({
    imports: [
        CoreModule,
        UIModule,
        AuthDeviceUserPageModule,
        AuthNewUserPageModule,
        ConfigurePasscodePageModule,
        ConfigureTouchIdPageModule,
        ForgottenPasswordPageModule,
        ResetPasscodePageModule
    ],
    exports: [
        AuthDeviceUserPageModule,
        AuthNewUserPageModule,
        ConfigurePasscodePageModule,
        ConfigureTouchIdPageModule,
        ForgottenPasswordPageModule,
        ResetPasscodePageModule
    ],
})
export class LoginModule { }
