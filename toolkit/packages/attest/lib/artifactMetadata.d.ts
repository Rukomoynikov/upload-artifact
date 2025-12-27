import { RequestHeaders } from '@octokit/types';
/**
 * Options for creating a storage record for an attested artifact.
 */
export type ArtifactOptions = {
    name: string;
    digest: string;
    version?: string;
    status?: string;
};
export type PackageRegistryOptions = {
    registryUrl: string;
    artifactUrl?: string;
    repo?: string;
    path?: string;
};
/**
 * Writes a storage record on behalf of an artifact that has been attested
 * @param artifactOptions - parameters for the storage record API request.
 * @param packageRegistryOptions - parameters for the package registry API request.
 * @param token - GitHub token used to authenticate the request.
 * @param retryAttempts - The number of retries to attempt if the request fails.
 * @param headers - Additional headers to include in the request.
 *
 * @returns The ID of the storage record.
 * @throws Error if the storage record fails to persist.
 */
export declare function createStorageRecord(artifactOptions: ArtifactOptions, packageRegistryOptions: PackageRegistryOptions, token: string, retryAttempts?: number, headers?: RequestHeaders): Promise<number[]>;
