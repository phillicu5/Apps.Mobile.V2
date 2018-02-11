import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

import { PluginWrapper } from './plugin.wrapper';

/**
 * Provides functionality for playing sounds on the device.
 */
@Injectable()
export class NativeAudioWrapper extends PluginWrapper {

    private soundAvailable: boolean;

    /**
     * Creates an instance of SoundWrapper.
     */
    constructor(
        platform: Platform,
        private nativeAudio: NativeAudio) {

        // Call the base method
        super(platform, 'SoundWrapper');

        // Check if sound is available
        this.soundAvailable = platform.is('cordova');
    }

    /**
     * Bootstraps the sound wrapper. This should only be called after the device is ready.
     */
    public bootstrap(): Promise<any> {

        var promise: Promise<any>

        // Pre-load the sounds
        if (this.soundAvailable) {
            promise = this.preloadSounds();
        }
        else {
            promise = Promise.resolve();
        }

        // Return
        return promise;
    }

    /**
     * Plays the noise with the specified ID.
     */
    public play(id: string): Promise<any> {

        // Exit if sound isn't available
        if (!this.soundAvailable) {
            this.logger.debug('Ignoring request to play sound as native audio is unavailable.')
            return;
        }

        // Return
        return this.nativeAudio.play(id, null);
    }

    /**
     * Plays the tap noise.
     */
    public playTap(): Promise<any> {

        // Exit if sound isn't available
        if (!this.soundAvailable) {
            this.logger.debug('Ignoring request to play tap as native audio is unavailable.')
            return;
        }

        // Return
        return this.play('tap');
    }

    /**
     * Pre-loads the sounds to avoid any delay when they are played for the first time.
     */
    private preloadSounds() {

        // Preload the sounds
        var promise = Promise.all([
            this.nativeAudio.preloadSimple('tap', 'assets/sounds/tap.aif')
        ]);

        // Handle the errors
        promise.catch(
            reason => {
                this.logger.error('An error occurred pre-loading the sounds.', reason);
            });

        // Return
        return promise;
    }
}