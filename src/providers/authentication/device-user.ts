import { PasscodeData } from './passcode-data';
import { TouchIDData } from './touch-id-data';

/**
 * Represents the details about the user who is stored on the device.
 * This can be considered the be the user who typically uses the app on the device.
 */
export class DeviceUser {
    public id: string;
    public firstName: string;
    public lastName: string;
    public emailAddress: string;
    public lastLoggedInAt: Date;
    public passcode: PasscodeData;
    public touchID: TouchIDData;

    /**
     * Creates an instance of DeviceUser.
     */
    constructor() {
        this.passcode = new PasscodeData();
        this.touchID = new TouchIDData();
    }
}
