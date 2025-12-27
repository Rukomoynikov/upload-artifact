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
exports.writeAttestation = void 0;
const github = __importStar(require("@actions/github"));
const plugin_retry_1 = require("@octokit/plugin-retry");
const CREATE_ATTESTATION_REQUEST = 'POST /repos/{owner}/{repo}/attestations';
const DEFAULT_RETRY_COUNT = 5;
/**
 * Writes an attestation to the repository's attestations endpoint.
 * @param attestation - The attestation to write.
 * @param token - The GitHub token for authentication.
 * @returns The ID of the attestation.
 * @throws Error if the attestation fails to persist.
 */
const writeAttestation = (attestation_1, token_1, ...args_1) => __awaiter(void 0, [attestation_1, token_1, ...args_1], void 0, function* (attestation, token, options = {}) {
    var _a;
    const retries = (_a = options.retry) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_COUNT;
    const octokit = github.getOctokit(token, { retry: { retries } }, plugin_retry_1.retry);
    try {
        const response = yield octokit.request(CREATE_ATTESTATION_REQUEST, {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            headers: options.headers,
            bundle: attestation
        });
        const data = typeof response.data == 'string'
            ? JSON.parse(response.data)
            : response.data;
        return data === null || data === void 0 ? void 0 : data.id;
    }
    catch (err) {
        const message = err instanceof Error ? err.message : err;
        throw new Error(`Failed to persist attestation: ${message}`);
    }
});
exports.writeAttestation = writeAttestation;
//# sourceMappingURL=store.js.map