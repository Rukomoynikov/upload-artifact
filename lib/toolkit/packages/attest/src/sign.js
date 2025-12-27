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
exports.signPayload = void 0;
const sign_1 = require("@sigstore/sign");
const OIDC_AUDIENCE = 'sigstore';
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 3;
/**
 * Signs the provided payload with a Sigstore-issued certificate and returns the
 * signature bundle.
 * @param payload Payload to be signed.
 * @param options Signing options.
 * @returns A promise that resolves to the Sigstore signature bundle.
 */
const signPayload = (payload, options) => __awaiter(void 0, void 0, void 0, function* () {
    const artifact = {
        data: payload.body,
        type: payload.type
    };
    // Sign the artifact and build the bundle
    return initBundleBuilder(options).create(artifact);
});
exports.signPayload = signPayload;
// Assembles the Sigstore bundle builder with the appropriate options
const initBundleBuilder = (opts) => {
    const identityProvider = new sign_1.CIContextProvider(OIDC_AUDIENCE);
    const timeout = opts.timeout || DEFAULT_TIMEOUT;
    const retry = opts.retry || DEFAULT_RETRIES;
    const witnesses = [];
    const signer = new sign_1.FulcioSigner({
        identityProvider,
        fulcioBaseURL: opts.fulcioURL,
        timeout,
        retry
    });
    if (opts.rekorURL) {
        witnesses.push(new sign_1.RekorWitness({
            rekorBaseURL: opts.rekorURL,
            fetchOnConflict: true,
            timeout,
            retry
        }));
    }
    if (opts.tsaServerURL) {
        witnesses.push(new sign_1.TSAWitness({
            tsaBaseURL: opts.tsaServerURL,
            timeout,
            retry
        }));
    }
    // Build the bundle with the singleCertificate option which will
    // trigger the creation of v0.3 DSSE bundles
    return new sign_1.DSSEBundleBuilder({ signer, witnesses });
};
//# sourceMappingURL=sign.js.map