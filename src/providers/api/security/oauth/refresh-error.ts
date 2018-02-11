/**
 * Defines the error can occur when refreshing the token
 */
export class RefreshError {
    public reason: RefreshErrorReason
}

/**
 * Defines the different reasons that an error can occur when refreshing the token.
 */
export enum RefreshErrorReason {
    InvalidClientCredentials,
    ClientDisabled,
    TokenExpired,
    InvalidToken,
    InvalidClient,
    UserLockedOut,
    Error
}