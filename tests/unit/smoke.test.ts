import { describe, expect, it } from 'vitest';
import { SITE } from '@/data/site';

describe('SITE', () => {
  it('define nombre y URLs absolutas https', () => {
    expect(SITE.name).not.toBe('');
    expect(SITE.githubUrl).toMatch(/^https:\/\//);
  });
});
