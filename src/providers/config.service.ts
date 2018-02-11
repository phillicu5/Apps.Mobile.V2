import { Injectable } from '@angular/core';

import { Config } from './config';

@Injectable()
export class ConfigService {

    /**
     * Creates an instance of ConfigService.
     */
    constructor(public config: Config) {
    }
}