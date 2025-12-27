import { SigstoreInstance } from './endpoints';
import type { Attestation, Subject } from './shared.types';
/**
 * Options for attesting a subject / predicate.
 */
export type AttestOptions = {
    /**
     * @deprecated Use `subjects` instead.
     **/
    subjectName?: string;
    /**
     * @deprecated Use `subjects` instead.
     **/
    subjectDigest?: Record<string, string>;
    subjects?: Subject[];
    predicateType: string;
    predicate: object;
    token: string;
    sigstore?: SigstoreInstance;
    headers?: {
        [header: string]: string | number | undefined;
    };
    skipWrite?: boolean;
};
/**
 * Generates an attestation for the given subject and predicate. The subject and
 * predicate are combined into an in-toto statement, which is then signed using
 * the identified Sigstore instance and stored as an attestation.
 * @param options - The options for attestation.
 * @returns A promise that resolves to the attestation.
 */
export declare function attest(options: AttestOptions): Promise<Attestation>;
