import {Ajv2020} from 'ajv/dist/2020.js';
import {expect, test} from 'vitest';
test('Draft 2020-12 rejects invalid inputs without mutation', () => {
  const ajv = new Ajv2020({strict: true, allErrors: true, coerceTypes: false, useDefaults: false, removeAdditional: false});
  const schema = {$schema: 'https://json-schema.org/draft/2020-12/schema', type: 'object',
    properties: {count: {type: 'integer', default: 1}}, required: ['count'], additionalProperties: false};
  expect(ajv.validateSchema(schema)).toBe(true);
  const validate = ajv.compile(schema);
  expect(validate({count: 1})).toBe(true);
  for (const input of [{count: '1'}, {}, {count: 1, extra: true}]) {
    const before = structuredClone(input);
    expect(validate(input)).toBe(false);
    expect(input).toEqual(before);
  }
});
