import { SecondaryAuthenticationMethod } from './secondary-authentication-method';

/**
 * Defines the authentication settings.
 */
export class AuthenticationSettings {

    public secondaryAuthenticationMethod: SecondaryAuthenticationMethod

    /**
     * Creates an instance of AuthenticationSettings.
     */
    constructor() {
        this.secondaryAuthenticationMethod = SecondaryAuthenticationMethod.None;
    }
}