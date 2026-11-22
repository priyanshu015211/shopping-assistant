import test from 'node:test';
import assert from 'node:assert/strict';
import { isSupportedAmazonUrl } from '../src/utils/amazonUrl.js';

test('accepts the configured Amazon marketplaces', () => {
  const supportedUrls = [
    'https://amazon.in/dp/B0ABCDE123',
    'https://www.amazon.in/dp/B0ABCDE123',
    'https://amazon.com/dp/B0ABCDE123',
    'https://www.amazon.com/dp/B0ABCDE123?th=1'
  ];

  for (const url of supportedUrls) {
    assert.equal(isSupportedAmazonUrl(url), true, `${url} should be supported`);
  }
});

test('rejects lookalike and unrelated domains', () => {
  const unsupportedUrls = [
    'https://amazon.in.example.com/dp/B0ABCDE123',
    'https://notamazon.in/dp/B0ABCDE123',
    'https://amazon.com.example.org/dp/B0ABCDE123',
    'https://example.com/'
  ];

  for (const url of unsupportedUrls) {
    assert.equal(isSupportedAmazonUrl(url), false, `${url} should be rejected`);
  }
});

test('rejects insecure schemes and non-standard ports', () => {
  assert.equal(isSupportedAmazonUrl('http://amazon.in/dp/B0ABCDE123'), false);
  assert.equal(isSupportedAmazonUrl('ftp://amazon.com/file'), false);
  assert.equal(isSupportedAmazonUrl('https://amazon.in:8443/dp/B0ABCDE123'), false);
});

test('rejects URLs with embedded credentials', () => {
  assert.equal(
    isSupportedAmazonUrl('https://user:password@amazon.in/dp/B0ABCDE123'),
    false
  );
});

test('handles malformed and non-string input safely', () => {
  assert.equal(isSupportedAmazonUrl('not a URL'), false);
  assert.equal(isSupportedAmazonUrl(''), false);
  assert.equal(isSupportedAmazonUrl(null), false);
  assert.equal(isSupportedAmazonUrl(undefined), false);
  assert.equal(isSupportedAmazonUrl(42), false);
});
