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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signingEndpoints = exports.SIGSTORE_PUBLIC_GOOD = void 0;
const github = __importStar(require("@actions/github"));
const PUBLIC_GOOD_ID = 'public-good';
const GITHUB_ID = 'github';
const FULCIO_PUBLIC_GOOD_URL = 'https://fulcio.sigstore.dev';
const REKOR_PUBLIC_GOOD_URL = 'https://rekor.sigstore.dev';
exports.SIGSTORE_PUBLIC_GOOD = {
    fulcioURL: FULCIO_PUBLIC_GOOD_URL,
    rekorURL: REKOR_PUBLIC_GOOD_URL
};
const signingEndpoints = (sigstore) => {
    var _a;
    let instance;
    // An explicitly set instance type takes precedence, but if not set, use the
    // repository's visibility to determine the instance type.
    if (sigstore && [PUBLIC_GOOD_ID, GITHUB_ID].includes(sigstore)) {
        instance = sigstore;
    }
    else {
        instance =
            ((_a = github.context.payload.repository) === null || _a === void 0 ? void 0 : _a.visibility) === 'public'
                ? PUBLIC_GOOD_ID
                : GITHUB_ID;
    }
    switch (instance) {
        case PUBLIC_GOOD_ID:
            return exports.SIGSTORE_PUBLIC_GOOD;
        case GITHUB_ID:
            return buildGitHubEndpoints();
    }
};
exports.signingEndpoints = signingEndpoints;
function buildGitHubEndpoints() {
    const serverURL = process.env.GITHUB_SERVER_URL || 'https://github.com';
    let host = new URL(serverURL).hostname;
    if (host === 'github.com') {
        host = 'githubapp.com';
    }
    return {
        fulcioURL: `https://fulcio.${host}`,
        tsaServerURL: `https://timestamp.${host}`
    };
}
//# sourceMappingURL=endpoints.js.map