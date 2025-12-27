import { RequestHeaders } from '@octokit/types';
export type WriteOptions = {
    retry?: number;
    headers?: RequestHeaders;
};
/**
 * Writes an attestation to the repository's attestations endpoint.
 * @param attestation - The attestation to write.
 * @param token - The GitHub token for authentication.
 * @returns The ID of the attestation.
 * @throws Error if the attestation fails to persist.
 */
export declare const writeAttestation: (attestation: unknown, token: string, options?: WriteOptions) => Promise<string>;
