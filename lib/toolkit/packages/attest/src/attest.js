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
exports.attest = attest;
const bundle_1 = require("@sigstore/bundle");
const crypto_1 = require("crypto");
const endpoints_1 = require("./endpoints");
const intoto_1 = require("./intoto");
const sign_1 = require("./sign");
const store_1 = require("./store");
const INTOTO_PAYLOAD_TYPE = 'application/vnd.in-toto+json';
/**
 * Generates an attestation for the given subject and predicate. The subject and
 * predicate are combined into an in-toto statement, which is then signed using
 * the identified Sigstore instance and stored as an attestation.
 * @param options - The options for attestation.
 * @returns A promise that resolves to the attestation.
 */
function attest(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let subjects;
        if (options.subjects) {
            subjects = options.subjects;
        }
        else if (options.subjectName && options.subjectDigest) {
            subjects = [{ name: options.subjectName, digest: options.subjectDigest }];
        }
        else {
            throw new Error('Must provide either subjectName and subjectDigest or subjects');
        }
        const predicate = {
            type: options.predicateType,
            params: options.predicate
        };
        const statement = (0, intoto_1.buildIntotoStatement)(subjects, predicate);
        // Sign the provenance statement
        const payload = {
            body: Buffer.from(JSON.stringify(statement)),
            type: INTOTO_PAYLOAD_TYPE
        };
        const endpoints = (0, endpoints_1.signingEndpoints)(options.sigstore);
        const bundle = yield (0, sign_1.signPayload)(payload, endpoints);
        // Store the attestation
        let attestationID;
        if (options.skipWrite !== true) {
            attestationID = yield (0, store_1.writeAttestation)((0, bundle_1.bundleToJSON)(bundle), options.token, { headers: options.headers });
        }
        return toAttestation(bundle, attestationID);
    });
}
function toAttestation(bundle, attestationID) {
    let certBytes;
    switch (bundle.verificationMaterial.content.$case) {
        case 'x509CertificateChain':
            certBytes =
                bundle.verificationMaterial.content.x509CertificateChain.certificates[0]
                    .rawBytes;
            break;
        case 'certificate':
            certBytes = bundle.verificationMaterial.content.certificate.rawBytes;
            break;
        default:
            throw new Error('Bundle must contain an x509 certificate');
    }
    const signingCert = new crypto_1.X509Certificate(certBytes);
    // Collect transparency log ID if available
    const tlogEntries = bundle.verificationMaterial.tlogEntries;
    const tlogID = tlogEntries.length > 0 ? tlogEntries[0].logIndex : undefined;
    return {
        bundle: (0, bundle_1.bundleToJSON)(bundle),
        certificate: signingCert.toString(),
        tlogID,
        attestationID
    };
}
//# sourceMappingURL=attest.js.map