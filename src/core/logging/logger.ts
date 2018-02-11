/**
 * Provides a basic logger.
 */
export class Logger {

    /**
     * Creates an instance of Logger.
     */
    constructor(public name: string) {
    }

    /**
     * Writes a log level entry to the console.
     */
    public log(message: string, ...optionalParams: any[]) {
        console.log(this.name + ': ' + message, ...optionalParams);
    }

    /**
     * Writes a trace level entry to the console.
     */
    public trace(message: string, ...optionalParams: any[]) {
        console.trace(this.name + ': ' + message, ...optionalParams);
    }

    /**
     * Writes a debug level entry to the console.
     */
    public debug(message: string, ...optionalParams: any[]) {
        console.debug(this.name + ': ' + message, ...optionalParams);
    }

    /**
     * Writes an info level entry to the console.
     */
    public info(message: string, ...optionalParams: any[]) {
        console.info(this.name + ': ' + message, ...optionalParams);
    }

    /**
     * Writes a warning level entry to the console.
     */
    public warn(message: string, ...optionalParams: any[]) {
        console.warn(this.name + ': ' + message, ...optionalParams);
    }

    /**
     * Writes an error level entry to the console.
     */
    public error(message: string, ...optionalParams: any[]) {
        console.error(this.name + ': ' + message, ...optionalParams);
    }
}