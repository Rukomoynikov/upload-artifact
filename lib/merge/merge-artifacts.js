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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunk = void 0;
exports.run = run;
const path = __importStar(require("path"));
const promises_1 = require("fs/promises");
const core = __importStar(require("@actions/core"));
const minimatch_1 = require("minimatch");
const artifact_1 = __importDefault(require("@actions/artifact"));
const input_helper_1 = require("./input-helper");
const upload_artifact_1 = require("../shared/upload-artifact");
const search_1 = require("../shared/search");
const PARALLEL_DOWNLOADS = 5;
const chunk = (arr, n) => arr.reduce((acc, cur, i) => {
    const index = Math.floor(i / n);
    acc[index] = [...(acc[index] || []), cur];
    return acc;
}, []);
exports.chunk = chunk;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = (0, input_helper_1.getInputs)();
        const tmpDir = yield (0, promises_1.mkdtemp)('merge-artifact');
        const listArtifactResponse = yield artifact_1.default.listArtifacts({
            latest: true
        });
        const matcher = new minimatch_1.Minimatch(inputs.pattern);
        const artifacts = listArtifactResponse.artifacts.filter(artifact => matcher.match(artifact.name));
        core.debug(`Filtered from ${listArtifactResponse.artifacts.length} to ${artifacts.length} artifacts`);
        if (artifacts.length === 0) {
            throw new Error(`No artifacts found matching pattern '${inputs.pattern}'`);
        }
        core.info(`Preparing to download the following artifacts:`);
        artifacts.forEach(artifact => {
            core.info(`- ${artifact.name} (ID: ${artifact.id}, Size: ${artifact.size})`);
        });
        const downloadPromises = artifacts.map(artifact => artifact_1.default.downloadArtifact(artifact.id, {
            path: inputs.separateDirectories
                ? path.join(tmpDir, artifact.name)
                : tmpDir
        }));
        const chunkedPromises = (0, exports.chunk)(downloadPromises, PARALLEL_DOWNLOADS);
        for (const chunk of chunkedPromises) {
            yield Promise.all(chunk);
        }
        const options = {};
        if (inputs.retentionDays) {
            options.retentionDays = inputs.retentionDays;
        }
        if (typeof inputs.compressionLevel !== 'undefined') {
            options.compressionLevel = inputs.compressionLevel;
        }
        const searchResult = yield (0, search_1.findFilesToUpload)(tmpDir, inputs.includeHiddenFiles);
        yield (0, upload_artifact_1.uploadArtifact)(inputs.name, searchResult.filesToUpload, searchResult.rootDirectory, options);
        core.info(`The ${artifacts.length} artifact(s) have been successfully merged!`);
        if (inputs.deleteMerged) {
            const deletePromises = artifacts.map(artifact => artifact_1.default.deleteArtifact(artifact.name));
            yield Promise.all(deletePromises);
            core.info(`The ${artifacts.length} artifact(s) have been deleted`);
        }
        try {
            yield (0, promises_1.rm)(tmpDir, { recursive: true });
        }
        catch (error) {
            core.warning(`Unable to remove temporary directory: ${error.message}`);
        }
    });
}
//# sourceMappingURL=merge-artifacts.js.map