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
exports.getInputs = getInputs;
const core = __importStar(require("@actions/core"));
const constants_1 = require("./constants");
/**
 * Helper to get all the inputs for the action
 */
function getInputs() {
    const name = core.getInput(constants_1.Inputs.Name, { required: true });
    const pattern = core.getInput(constants_1.Inputs.Pattern, { required: true });
    const separateDirectories = core.getBooleanInput(constants_1.Inputs.SeparateDirectories);
    const deleteMerged = core.getBooleanInput(constants_1.Inputs.DeleteMerged);
    const includeHiddenFiles = core.getBooleanInput(constants_1.Inputs.IncludeHiddenFiles);
    const inputs = {
        name,
        pattern,
        separateDirectories,
        deleteMerged,
        retentionDays: 0,
        compressionLevel: 6,
        includeHiddenFiles
    };
    const retentionDaysStr = core.getInput(constants_1.Inputs.RetentionDays);
    if (retentionDaysStr) {
        inputs.retentionDays = parseInt(retentionDaysStr);
        if (isNaN(inputs.retentionDays)) {
            core.setFailed('Invalid retention-days');
        }
    }
    const compressionLevelStr = core.getInput(constants_1.Inputs.CompressionLevel);
    if (compressionLevelStr) {
        inputs.compressionLevel = parseInt(compressionLevelStr);
        if (isNaN(inputs.compressionLevel)) {
            core.setFailed('Invalid compression-level');
        }
        if (inputs.compressionLevel < 0 || inputs.compressionLevel > 9) {
            core.setFailed('Invalid compression-level. Valid values are 0-9');
        }
    }
    return inputs;
}
//# sourceMappingURL=input-helper.js.map