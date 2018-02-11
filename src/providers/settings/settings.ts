import { RootSettings } from './root-settings';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {

    private SETTINGS_KEY: string = '_settings';

    settings: any;

    _defaults: any;
    _readyPromise: Promise<any>;

    /**
     * Gets the current settings.
     */
    public get current(): RootSettings {
        return this.settings;
    }

    /**
     * Creates an instance of Settings.
     */
    constructor(
        public storage: Storage) {

        this._defaults = new RootSettings();
    }

    public bootstrap() {
        return this.storage.get(this.SETTINGS_KEY)
            .then((value) => {
                if (value) {
                    this.settings = value;
                    return this._mergeDefaults(this._defaults);
                } else {
                    return this
                        .setAll(this._defaults)
                        .then((val) => {
                            this.settings = val;
                        })
                }
            });
    }

    _mergeDefaults(defaults: any) {
        for (let k in defaults) {
            if (!(k in this.settings)) {
                this.settings[k] = defaults[k];
            }
        }
        return this.setAll(this.settings);
    }

    merge(settings: RootSettings) {
        for (let k in settings) {
            this.settings[k] = settings[k];
        }
        return this.save();
    }

    setValue(key: string, value: any) {
        this.settings[key] = value;
        return this.storage.set(this.SETTINGS_KEY, this.settings);
    }

    setAll(value: any) {
        return this.storage.set(this.SETTINGS_KEY, value);
    }

    getValue(key: string) {
        return this.storage.get(this.SETTINGS_KEY)
            .then(settings => {
                return settings[key];
            });
    }

    save() {
        return this.setAll(this.settings);
    }
}
