/**
 * Defines the data about the passcode. The actual passcode itself is not part of this object
 * for security reasons.
 */
export class PasscodeData {

    public enabled: boolean;
    public failedAttempts: number;
    public locked: boolean;

    /**
     * Creates an instance of PasscodeData.
     */
    constructor() {
        this.enabled = false;
        this.failedAttempts = 0;
        this.locked = false;
    }
}