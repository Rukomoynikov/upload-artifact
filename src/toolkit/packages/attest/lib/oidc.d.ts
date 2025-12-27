declare const REQUIRED_CLAIMS: readonly ["iss", "ref", "sha", "repository", "event_name", "job_workflow_ref", "workflow_ref", "repository_id", "repository_owner_id", "runner_environment", "run_id", "run_attempt"];
export type ClaimSet = {
    [K in (typeof REQUIRED_CLAIMS)[number]]: string;
};
export declare const getIDTokenClaims: (issuer?: string) => Promise<ClaimSet>;
export {};
