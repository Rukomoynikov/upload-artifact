declare const PUBLIC_GOOD_ID = "public-good";
declare const GITHUB_ID = "github";
export type SigstoreInstance = typeof PUBLIC_GOOD_ID | typeof GITHUB_ID;
export type Endpoints = {
    fulcioURL: string;
    rekorURL?: string;
    tsaServerURL?: string;
};
export declare const SIGSTORE_PUBLIC_GOOD: Endpoints;
export declare const signingEndpoints: (sigstore?: SigstoreInstance) => Endpoints;
export {};
