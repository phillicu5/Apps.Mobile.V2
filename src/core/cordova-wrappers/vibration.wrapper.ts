import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { PluginWrapper } from './plugin.wrapper';

/**
 * Provides functionality for vibrating the device.
 */
@Injectable()
export class VibrationWrapper extends PluginWrapper {

    /**
     * Creates an instance of VibrationWrapper.
     */
    constructor(
        platform: Platform,
        private vibration: Vibration) {

        // Call the base method
        super(platform, 'VibrationWrapper');
    }

    /**
     * Vibrates the device for the given amount of time.
     */
    public vibrate(time: number | number[]) {

        this.logger.debug('Vibrating device for ' + time + 'ms');

        // Vibrate
        this.vibration.vibrate(time);
    }
}