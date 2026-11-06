import {expect, test} from 'vitest';
import {parseDocument} from '../../src/validator/parse.js';
import {validateDocument} from '../../src/validator/index.js';
test.each(['{}', '[]', 'null', '42', '"text"'])('JSON is parsed, not accepted as IR: %s', text => {
  const value: unknown = JSON.parse(text);
  expect(parseDocument(text)).toEqual({ok: true, value});
  expect(validateDocument(text)).toMatchObject({status: 'tool-error', diagnostics: [{code: 'AFIR-TOOL-003'}]});
});
test.each(['', '{', '{"a":1,}', '\uFEFF{}'])('malformed JSON: %s', text => {
  expect(validateDocument(text)).toEqual({status: 'invalid', diagnostics: [
    {code: 'AFIR-PARSE-001', severity: 'error', message: 'Input is not valid JSON.'}
  ]});
});
