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
exports.run = run;
const core = __importStar(require("@actions/core"));
const artifact_1 = __importStar(require("@actions/artifact"));
const search_1 = require("../shared/search");
const input_helper_1 = require("./input-helper");
const constants_1 = require("./constants");
const upload_artifact_1 = require("../shared/upload-artifact");
function deleteArtifactIfExists(artifactName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield artifact_1.default.deleteArtifact(artifactName);
        }
        catch (error) {
            if (error instanceof artifact_1.ArtifactNotFoundError) {
                core.debug(`Skipping deletion of '${artifactName}', it does not exist`);
                return;
            }
            // Best effort, we don't want to fail the action if this fails
            core.debug(`Unable to delete artifact: ${error.message}`);
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = (0, input_helper_1.getInputs)();
        const searchResult = yield (0, search_1.findFilesToUpload)(inputs.searchPath, inputs.includeHiddenFiles);
        if (searchResult.filesToUpload.length === 0) {
            // No files were found, different use cases warrant different types of behavior if nothing is found
            switch (inputs.ifNoFilesFound) {
                case constants_1.NoFileOptions.warn: {
                    core.warning(`No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`);
                    break;
                }
                case constants_1.NoFileOptions.error: {
                    core.setFailed(`No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`);
                    break;
                }
                case constants_1.NoFileOptions.ignore: {
                    core.info(`No files were found with the provided path: ${inputs.searchPath}. No artifacts will be uploaded.`);
                    break;
                }
            }
        }
        else {
            const s = searchResult.filesToUpload.length === 1 ? '' : 's';
            core.info(`With the provided path, there will be ${searchResult.filesToUpload.length} file${s} uploaded`);
            core.debug(`Root artifact directory is ${searchResult.rootDirectory}`);
            if (inputs.overwrite) {
                yield deleteArtifactIfExists(inputs.artifactName);
            }
            const options = {};
            if (inputs.retentionDays) {
                options.retentionDays = inputs.retentionDays;
            }
            if (typeof inputs.compressionLevel !== 'undefined') {
                options.compressionLevel = inputs.compressionLevel;
            }
            yield (0, upload_artifact_1.uploadArtifact)(inputs.artifactName, searchResult.filesToUpload, searchResult.rootDirectory, options);
        }
    });
}
//# sourceMappingURL=upload-artifact.js.map