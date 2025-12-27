import { Bundle } from '@sigstore/sign';
/**
 * The payload to be signed (body) and its media type (type).
 */
export type Payload = {
    body: Buffer;
    type: string;
};
/**
 * Options for signing a document.
 */
export type SignOptions = {
    /**
     * The URL of the Fulcio service.
     */
    fulcioURL: string;
    /**
     * The URL of the Rekor service.
     */
    rekorURL?: string;
    /**
     * The URL of the TSA (Time Stamping Authority) server.
     */
    tsaServerURL?: string;
    /**
     * The timeout duration in milliseconds when communicating with Sigstore
     * services.
     */
    timeout?: number;
    /**
     * The number of retry attempts.
     */
    retry?: number;
};
/**
 * Signs the provided payload with a Sigstore-issued certificate and returns the
 * signature bundle.
 * @param payload Payload to be signed.
 * @param options Signing options.
 * @returns A promise that resolves to the Sigstore signature bundle.
 */
export declare const signPayload: (payload: Payload, options: SignOptions) => Promise<Bundle>;
