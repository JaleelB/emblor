import { describe, expect, it } from 'vitest';
import { evaluateBatch, evaluateCandidate } from '../../src/core/evaluator';

const base = {
  values: [],
  source: 'keyboard' as const,
  allowDuplicates: false,
};

describe('Emblor candidate pipeline', () => {
  it('trims, transforms, counts code points, and validates the canonical value', () => {
    expect(evaluateCandidate({ ...base, rawValue: '  😀  ', maxLength: 1, transform: (value) => value })).toEqual({
      accepted: true,
      value: '😀',
    });
    expect(evaluateCandidate({ ...base, rawValue: '  too  ', maxLength: 2 })).toMatchObject({
      accepted: false,
      rejection: { rawValue: '  too  ', value: 'too', reason: 'max-length' },
    });
  });

  it('evaluates duplicate and capacity constraints against accepted batch values', () => {
    const result = evaluateBatch({
      candidates: ['one', 'one', 'two', 'three'],
      values: [],
      maxTags: 2,
      allowDuplicates: false,
      source: 'paste',
    });
    expect(result.values).toEqual(['one', 'two']);
    expect(result.rejections.map((item) => item.reason)).toEqual(['duplicate', 'max-tags']);
  });

  it('does not truncate and reports transformed custom failures', () => {
    expect(
      evaluateCandidate({ ...base, rawValue: 'abcdef', transform: (value) => value.slice(0, 3), maxLength: 3 }),
    ).toEqual({
      accepted: true,
      value: 'abc',
    });
    expect(
      evaluateCandidate({
        ...base,
        rawValue: ' bad ',
        transform: (value) => value.toUpperCase(),
        validate: () => false,
      }),
    ).toMatchObject({
      accepted: false,
      rejection: { rawValue: ' bad ', value: 'BAD', reason: 'custom' },
    });
  });
});
