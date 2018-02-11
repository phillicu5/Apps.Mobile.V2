/**
 * Defines the data about the usage of TouchID in relation to this application.
 */
export class TouchIDData {

    public enabled: boolean;
    public failedAttempts: number;
    public locked: boolean;

    /**
     * Creates an instance of TouchIDData.
     */
    constructor() {
        this.enabled = false;
        this.failedAttempts = 0;
        this.locked = false;
    }
}