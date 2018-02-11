/**
 * Defines the error can occur when authenticating the user.
 */
export class AuthenticateError {
    public reason: AuthenticateErrorReason
}

/**
 * Defines the different reasons that an error can occur when authenticating the user.
 */
export enum AuthenticateErrorReason {
    InvalidClientCredentials,
    ClientDisabled,
    InvalidUserCredentials,
    UserLockedOut,
    InvalidUserType,
    Error
}