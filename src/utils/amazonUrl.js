const SUPPORTED_AMAZON_HOSTNAMES = new Set([
  'amazon.in',
  'www.amazon.in',
  'amazon.com',
  'www.amazon.com'
]);

/**
 * Returns true only for HTTPS pages on the Amazon marketplaces supported by
 * the extension. Exact hostname matching avoids lookalike domains.
 */
export function isSupportedAmazonUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      SUPPORTED_AMAZON_HOSTNAMES.has(url.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}
