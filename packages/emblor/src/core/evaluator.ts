import type { EmblorRejectReason, EmblorRejection } from '../types';
import { countCodePoints } from '../utils';

export type CandidateOptions = {
  rawValue: string;
  values: string[];
  source: 'keyboard' | 'paste' | 'blur';
  minLength?: number;
  maxLength?: number;
  maxTags?: number;
  allowDuplicates: boolean;
  transform?: (value: string) => string;
  validate?: (value: string) => boolean;
};

export type CandidateEvaluation = { accepted: true; value: string } | { accepted: false; rejection: EmblorRejection };

function rejected(
  rawValue: string,
  value: string,
  reason: EmblorRejectReason,
  source: CandidateOptions['source'],
): CandidateEvaluation {
  return {
    accepted: false,
    rejection: { rawValue, value, reason, source },
  };
}

export function evaluateCandidate(options: CandidateOptions): CandidateEvaluation {
  const { rawValue, values, source, minLength, maxLength, maxTags, allowDuplicates, transform, validate } = options;
  let value = rawValue.trim();

  if (value.length === 0) {
    return rejected(rawValue, value, 'empty', source);
  }

  if (transform) {
    value = transform(value);
    if (typeof value !== 'string') {
      throw new Error('EmblorRoot transform must return a string.');
    }
  }

  if (value.length === 0) {
    return rejected(rawValue, value, 'empty', source);
  }

  const length = countCodePoints(value);
  if (minLength !== undefined && length < minLength) {
    return rejected(rawValue, value, 'min-length', source);
  }
  if (maxLength !== undefined && length > maxLength) {
    return rejected(rawValue, value, 'max-length', source);
  }
  if (!allowDuplicates && values.includes(value)) {
    return rejected(rawValue, value, 'duplicate', source);
  }
  if (maxTags !== undefined && values.length >= maxTags) {
    return rejected(rawValue, value, 'max-tags', source);
  }
  if (validate && !validate(value)) {
    return rejected(rawValue, value, 'custom', source);
  }

  return { accepted: true, value };
}

export function evaluateBatch(
  options: Omit<CandidateOptions, 'rawValue' | 'source'> & {
    candidates: string[];
    source: 'paste';
  },
): { values: string[]; rejections: EmblorRejection[] } {
  const nextValues = [...options.values];
  const accepted: string[] = [];
  const rejections: EmblorRejection[] = [];

  options.candidates.forEach(function evaluate(rawValue) {
    if (rawValue.trim().length === 0) {
      return;
    }

    const result = evaluateCandidate({
      ...options,
      rawValue,
      values: nextValues,
      source: 'paste',
    });

    if (result.accepted) {
      accepted.push(result.value);
      nextValues.push(result.value);
    } else {
      rejections.push(result.rejection);
    }
  });

  return { values: accepted, rejections };
}
