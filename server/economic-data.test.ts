// Exercise invalid and future observations so unavailable data cannot silently become a judicial threshold.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSeries, SERIES } from './economic-data';
const payload = (rows: unknown[]) => ({ data: rows, meta: [{}, { field: { id: SERIES.smvm }, dataset: { source: 'Official test fixture' } }] });
test('selects the most recent eligible positive value, ignoring future and null rows', () => {
  const result = parseSeries(payload([['2026-09-01', 300], ['2026-07-01', 100], ['2026-08-01', 200], ['2026-08-01', null]]), SERIES.smvm, '2026-08-20');
  assert.equal(result.value, 200);
  assert.equal(result.period, '2026-08-01');
});
test('rejects mismatched series and unusable observations', () => {
  assert.throws(() => parseSeries(payload([['2026-01-01', 100]]), SERIES.cba));
  for (const value of [null, 0, -1, '100', Infinity]) {
    assert.throws(() => parseSeries(payload([['2026-01-01', value]]), SERIES.smvm));
  }
  assert.throws(() => parseSeries({ error: 'upstream' }, SERIES.smvm));
});
