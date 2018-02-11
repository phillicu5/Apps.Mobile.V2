import { AuthenticationSettings } from './authentication-settings';

export class RootSettings {

    public hasViewedWelcomePage: boolean;

    public authentication: AuthenticationSettings;

    /**
     * Creates an instance of RootSettings.
     */
    constructor() {
        this.authentication = new AuthenticationSettings();
    }
}