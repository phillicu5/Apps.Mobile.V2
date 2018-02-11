/**
 * Defines the configuration for the application.
 */
export class Config {

    //public baseApiUrl: string = 'http://192.168.195.159/public/api';
    public baseApiUrl: string = 'https://00527-ws.parentpay.local/public/api';
    //public baseApiUrl: string = '/api';
    public clientId: string = 'PublicMobileApp';
    public clientSecret: string = 'PunyGod';

    public asyncTicketingRetryInterval: number = 1000;
    public asyncTicketingRetryTimeout: number = 30000;
}