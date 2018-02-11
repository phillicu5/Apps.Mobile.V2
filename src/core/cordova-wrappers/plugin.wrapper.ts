import { Platform } from 'ionic-angular';

import { Logger, LoggerFactory } from '../logging';

/**
 * Defines the base class for wrappers that wrap a Cordova plugin and provide exception-safe
 * functionality, with fallbacks where available, when running in non-Cordova environment.
 */
export abstract class PluginWrapper {

    /**
     * Provides a logger for plugin wrapper implementations.
     */
    protected logger: Logger;

    /**
     * Returns a value indicating whether Cordova is available or not.
     */
    protected cordovaAvailable: boolean = false;

    /**
     * Creates an instance of PluginWrapper.
     */
    constructor(
        protected platform: Platform,
        typeName: string) {

        // Create the logger
        this.logger = LoggerFactory.create(typeName);

        // Check if cordova is available
        this.cordovaAvailable = platform.is('cordova');
    }
}