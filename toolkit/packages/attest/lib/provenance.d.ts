import { AttestOptions } from './attest';
import type { Attestation, Predicate } from './shared.types';
export type AttestProvenanceOptions = Omit<AttestOptions, 'predicate' | 'predicateType'> & {
    issuer?: string;
};
/**
 * Builds an SLSA (Supply Chain Levels for Software Artifacts) provenance
 * predicate using the GitHub Actions Workflow build type.
 * https://slsa.dev/spec/v1.0/provenance
 * https://github.com/slsa-framework/github-actions-buildtypes/tree/main/workflow/v1
 * @param issuer - URL for the OIDC issuer. Defaults to the GitHub Actions token
 * issuer.
 * @returns The SLSA provenance predicate.
 */
export declare const buildSLSAProvenancePredicate: (issuer?: string) => Promise<Predicate>;
/**
 * Attests the build provenance of the provided subject. Generates the SLSA
 * build provenance predicate, assembles it into an in-toto statement, and
 * attests it.
 *
 * @param options - The options for attesting the provenance.
 * @returns A promise that resolves to the attestation.
 */
export declare function attestProvenance(options: AttestProvenanceOptions): Promise<Attestation>;
