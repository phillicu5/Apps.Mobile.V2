/**
 * Defines an implementation of a deferred promise.
 */
export class Deferred<T> {

    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;

    /**
     * Creates an instance of Deferred.
     */
    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}