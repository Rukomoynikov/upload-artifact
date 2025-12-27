"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIntotoStatement = void 0;
const INTOTO_STATEMENT_V1_TYPE = 'https://in-toto.io/Statement/v1';
/**
 * Assembles the given subject and predicate into an in-toto statement.
 * @param subject - The subject of the statement.
 * @param predicate - The predicate of the statement.
 * @returns The constructed in-toto statement.
 */
const buildIntotoStatement = (subjects, predicate) => {
    return {
        _type: INTOTO_STATEMENT_V1_TYPE,
        subject: subjects,
        predicateType: predicate.type,
        predicate: predicate.params
    };
};
exports.buildIntotoStatement = buildIntotoStatement;
//# sourceMappingURL=intoto.js.map