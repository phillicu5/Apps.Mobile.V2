/**
 * Defines the model for the response that is returned by the token endpoint.
 */
export class TokenResponseModel {
    access_token: string;
    expires_in: Date;
    refresh_token: string;
    refresh_token_expires_in: number;
    token_type: string;
    user_id: string;
    user_first_name: string;
    user_last_name: string;
    user_name: string;
    user_roles: string;
    user_type: string;
}