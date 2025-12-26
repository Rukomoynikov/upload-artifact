"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getIDTokenClaims = void 0;
const core_1 = require("@actions/core");
const http_client_1 = require("@actions/http-client");
const jose = __importStar(require("jose"));
const OIDC_AUDIENCE = 'nobody';
const VALID_SERVER_URLS = [
    'https://github.com',
    new RegExp('^https://[a-z0-9-]+\\.ghe\\.com$')
];
const REQUIRED_CLAIMS = [
    'iss',
    'ref',
    'sha',
    'repository',
    'event_name',
    'job_workflow_ref',
    'workflow_ref',
    'repository_id',
    'repository_owner_id',
    'runner_environment',
    'run_id',
    'run_attempt'
];
const getIDTokenClaims = (issuer) => __awaiter(void 0, void 0, void 0, function* () {
    issuer = issuer || getIssuer();
    try {
        const token = yield (0, core_1.getIDToken)(OIDC_AUDIENCE);
        const claims = yield decodeOIDCToken(token, issuer);
        assertClaimSet(claims);
        return claims;
    }
    catch (error) {
        throw new Error(`Failed to get ID token: ${error.message}`);
    }
});
exports.getIDTokenClaims = getIDTokenClaims;
const decodeOIDCToken = (token, issuer) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify and decode token
    const jwks = jose.createLocalJWKSet(yield getJWKS(issuer));
    const { payload } = yield jose.jwtVerify(token, jwks, {
        audience: OIDC_AUDIENCE
    });
    if (!payload.iss) {
        throw new Error('Missing "iss" claim');
    }
    // Check that the issuer STARTS WITH the expected issuer URL to account for
    // the fact that the value may include an enterprise-specific slug
    if (!payload.iss.startsWith(issuer)) {
        throw new Error(`Unexpected "iss" claim: ${payload.iss}`);
    }
    return payload;
});
const getJWKS = (issuer) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new http_client_1.HttpClient('@actions/attest');
    const config = yield client.getJson(`${issuer}/.well-known/openid-configuration`);
    if (!config.result) {
        throw new Error('No OpenID configuration found');
    }
    const jwks = yield client.getJson(config.result.jwks_uri);
    if (!jwks.result) {
        throw new Error('No JWKS found for issuer');
    }
    return jwks.result;
});
function assertClaimSet(claims) {
    const missingClaims = [];
    for (const claim of REQUIRED_CLAIMS) {
        if (!(claim in claims)) {
            missingClaims.push(claim);
        }
    }
    if (missingClaims.length > 0) {
        throw new Error(`Missing claims: ${missingClaims.join(', ')}`);
    }
}
// Derive the current OIDC issuer based on the server URL
function getIssuer() {
    const serverURL = process.env.GITHUB_SERVER_URL || 'https://github.com';
    // Ensure the server URL is a valid GitHub server URL
    if (!VALID_SERVER_URLS.some(valid_url => serverURL.match(valid_url))) {
        throw new Error(`Invalid server URL: ${serverURL}`);
    }
    let host = new URL(serverURL).hostname;
    if (host === 'github.com') {
        host = 'githubusercontent.com';
    }
    return `https://token.actions.${host}`;
}
//# sourceMappingURL=oidc.js.map