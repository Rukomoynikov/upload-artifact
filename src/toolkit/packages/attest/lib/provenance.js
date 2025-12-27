"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSLSAProvenancePredicate = void 0;
exports.attestProvenance = attestProvenance;
const attest_1 = require("./attest");
const oidc_1 = require("./oidc");
const SLSA_PREDICATE_V1_TYPE = 'https://slsa.dev/provenance/v1';
const GITHUB_BUILD_TYPE = 'https://actions.github.io/buildtypes/workflow/v1';
/**
 * Builds an SLSA (Supply Chain Levels for Software Artifacts) provenance
 * predicate using the GitHub Actions Workflow build type.
 * https://slsa.dev/spec/v1.0/provenance
 * https://github.com/slsa-framework/github-actions-buildtypes/tree/main/workflow/v1
 * @param issuer - URL for the OIDC issuer. Defaults to the GitHub Actions token
 * issuer.
 * @returns The SLSA provenance predicate.
 */
const buildSLSAProvenancePredicate = (issuer) => __awaiter(void 0, void 0, void 0, function* () {
    const serverURL = process.env.GITHUB_SERVER_URL;
    const claims = yield (0, oidc_1.getIDTokenClaims)(issuer);
    // Split just the path and ref from the workflow string.
    // owner/repo/.github/workflows/main.yml@main =>
    //   .github/workflows/main.yml, main
    const [workflowPath] = claims.workflow_ref
        .replace(`${claims.repository}/`, '')
        .split('@');
    return {
        type: SLSA_PREDICATE_V1_TYPE,
        params: {
            buildDefinition: {
                buildType: GITHUB_BUILD_TYPE,
                externalParameters: {
                    workflow: {
                        ref: claims.ref,
                        repository: `${serverURL}/${claims.repository}`,
                        path: workflowPath
                    }
                },
                internalParameters: {
                    github: {
                        event_name: claims.event_name,
                        repository_id: claims.repository_id,
                        repository_owner_id: claims.repository_owner_id,
                        runner_environment: claims.runner_environment
                    }
                },
                resolvedDependencies: [
                    {
                        uri: `git+${serverURL}/${claims.repository}@${claims.ref}`,
                        digest: {
                            gitCommit: claims.sha
                        }
                    }
                ]
            },
            runDetails: {
                builder: {
                    id: `${serverURL}/${claims.job_workflow_ref}`
                },
                metadata: {
                    invocationId: `${serverURL}/${claims.repository}/actions/runs/${claims.run_id}/attempts/${claims.run_attempt}`
                }
            }
        }
    };
});
exports.buildSLSAProvenancePredicate = buildSLSAProvenancePredicate;
/**
 * Attests the build provenance of the provided subject. Generates the SLSA
 * build provenance predicate, assembles it into an in-toto statement, and
 * attests it.
 *
 * @param options - The options for attesting the provenance.
 * @returns A promise that resolves to the attestation.
 */
function attestProvenance(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const predicate = yield (0, exports.buildSLSAProvenancePredicate)(options.issuer);
        return (0, attest_1.attest)(Object.assign(Object.assign({}, options), { predicateType: predicate.type, predicate: predicate.params }));
    });
}
//# sourceMappingURL=provenance.js.map