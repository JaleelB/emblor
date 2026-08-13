import { describe, expect, it, vi } from 'vitest';
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

  it('evaluates non-empty whitespace candidates through transform in single and batch paths', () => {
    const transform = vi.fn((value: string) => (value.length === 0 ? 'fallback' : value));
    expect(
      evaluateCandidate({
        rawValue: '   ',
        values: [],
        source: 'keyboard',
        allowDuplicates: false,
        transform,
      }),
    ).toEqual({ accepted: true, value: 'fallback' });

    expect(
      evaluateBatch({
        candidates: ['', '   ', 'one'],
        values: [],
        source: 'paste',
        allowDuplicates: false,
        transform,
      }),
    ).toEqual({ values: ['fallback', 'one'], rejections: [] });
    expect(transform).toHaveBeenCalledWith('');
  });

  it('reports whitespace transformed to empty while ignoring truly empty batch segments', () => {
    const result = evaluateBatch({
      candidates: ['', '   '],
      values: [],
      source: 'paste',
      allowDuplicates: false,
      transform: () => '',
    });
    expect(result).toEqual({
      values: [],
      rejections: [{ rawValue: '   ', value: '', reason: 'empty', source: 'paste' }],
    });
  });

  it('uses the accepted rejection order and keeps zero bounds independent from emptiness', () => {
    expect(evaluateCandidate({ ...base, rawValue: 'a', minLength: 2 })).toMatchObject({
      accepted: false,
      rejection: { reason: 'min-length' },
    });
    expect(evaluateCandidate({ ...base, rawValue: 'a', maxLength: 0 })).toMatchObject({
      accepted: false,
      rejection: { reason: 'max-length' },
    });
    expect(evaluateCandidate({ ...base, rawValue: '', minLength: 0, maxLength: 0 })).toMatchObject({
      accepted: false,
      rejection: { reason: 'empty' },
    });
    expect(
      evaluateCandidate({
        ...base,
        rawValue: 'one',
        values: ['one'],
        minLength: 3,
        maxLength: 3,
        maxTags: 1,
        validate: () => false,
      }),
    ).toMatchObject({ accepted: false, rejection: { reason: 'duplicate' } });
  });

  it('counts canonical Unicode code points rather than UTF-16 units or grapheme clusters', () => {
    const supplementary = '\u{1F600}';
    const combiningSequence = 'e\u0301';
    const flag = '\u{1F1FA}\u{1F1F8}';
    const zwjSequence = '\u{1F469}\u200D\u{1F4BB}';
    expect(evaluateCandidate({ ...base, rawValue: supplementary, maxLength: 1 })).toEqual({
      accepted: true,
      value: supplementary,
    });
    expect(evaluateCandidate({ ...base, rawValue: combiningSequence, maxLength: 1 })).toMatchObject({
      accepted: false,
      rejection: { reason: 'max-length' },
    });
    expect(evaluateCandidate({ ...base, rawValue: flag, maxLength: 2 })).toEqual({
      accepted: true,
      value: flag,
    });
    expect(evaluateCandidate({ ...base, rawValue: zwjSequence, maxLength: 2 })).toMatchObject({
      accepted: false,
      rejection: { reason: 'max-length' },
    });
  });

  it('checks transformed duplicates against values already accepted in the same batch', () => {
    const result = evaluateBatch({
      candidates: [' One ', 'one', 'TWO'],
      values: [],
      source: 'paste',
      allowDuplicates: false,
      transform: (value) => value.toLowerCase(),
    });
    expect(result.values).toEqual(['one', 'two']);
    expect(result.rejections).toEqual([{ rawValue: 'one', value: 'one', reason: 'duplicate', source: 'paste' }]);
  });
});
