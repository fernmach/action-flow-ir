import type {ValidationResult} from './diagnostics.js';
export type ParseResult = {ok: true; value: unknown} | {ok: false; result: ValidationResult};
export function parseDocument(text: string): ParseResult {
  try {
    const value: unknown = JSON.parse(text);
    return {ok: true, value};
  } catch {
    return {ok: false, result: {status: 'invalid', diagnostics: [
      {code: 'AFIR-PARSE-001', severity: 'error', message: 'Input is not valid JSON.'}
    ]}};
  }
}
