/*
 * Amazon product-page content script.
 * Reads details from the product page currently open in the browser.
 * It does not crawl Amazon, bypass access controls, or transmit page data.
 */

(() => {
  const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();

  function firstText(selectors) {
    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        const text = cleanText(element.textContent);
        if (text) return text;
      }
    }
    return '';
  }

  function getAsin() {
    const match = window.location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i);
    return match ? match[1].toUpperCase() : '';
  }

  function normalizeBrand(rawValue) {
    let value = cleanText(rawValue);
    if (!value) return '';

    // Amazon's byline commonly says "Visit the Acer Store" or "Shop the Acer Store".
    const storeMatch = value.match(/^(?:visit|shop)\s+the\s+(.+?)\s+store\b/i);
    if (storeMatch) return cleanText(storeMatch[1]);

    const labelMatch = value.match(/^(?:brand|manufacturer)\s*:\s*(.+)$/i);
    if (labelMatch) value = cleanText(labelMatch[1]);

    // Avoid displaying navigation or seller text as a brand.
    if (/^(?:visit|shop)\s+the\b/i.test(value)) return '';
    return value;
  }

  function getBrand() {
    const metaBrand = document.querySelector('meta[name="title"]')?.getAttribute('data-brand');
    const selectors = [
      '#productOverview_feature_div tr.po-brand td.a-span9',
      '#productOverview_feature_div .po-brand .po-break-word',
      '#productDetails_detailBullets_sections1 tr',
      '#detailBullets_feature_div li',
      '#bylineInfo'
    ];

    if (metaBrand) {
      const brand = normalizeBrand(metaBrand);
      if (brand) return brand;
    }

    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        const text = cleanText(element.textContent);
        if (!text) continue;

        if (selector.includes('tr')) {
          const header = cleanText(element.querySelector('th')?.textContent);
          if (/^(brand|manufacturer)$/i.test(header)) {
            const value = cleanText(element.querySelector('td')?.textContent);
            const brand = normalizeBrand(value);
            if (brand) return brand;
          }
        } else if (selector.endsWith('li')) {
          const match = text.match(/(?:^|\s)(?:Brand|Manufacturer)\s*:\s*(.+)$/i);
          if (match) {
            const brand = normalizeBrand(match[1]);
            if (brand) return brand;
          }
        } else {
          const brand = normalizeBrand(text);
          if (brand) return brand;
        }
      }
    }

    return 'Not available on this page';
  }

  function getRating() {
    const selectors = [
      '[data-hook="rating-out-of-5"]',
      '#acrPopover',
      'i.a-icon-star span.a-icon-alt'
    ];

    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        const raw = cleanText([
          element.getAttribute('title'),
          element.getAttribute('aria-label'),
          element.textContent
        ].filter(Boolean).join(' '));

        const match = raw.match(/\b([0-5](?:\.\d+)?)\s*(?:out of|\/|of)\s*5\b/i)
          || raw.match(/\b([0-5](?:\.\d+)?)\b/);
        if (match) return `${Number(match[1]).toFixed(1)} / 5`;
      }
    }

    return 'Not available on this page';
  }

  function getRatingCount() {
    const raw = firstText([
      '#acrCustomerReviewText',
      '[data-hook="total-review-count"]'
    ]);
    if (!raw) return 'Not available on this page';

    const match = raw.match(/[\d,]+/);
    if (!match) return raw;
    return Number(match[0].replace(/,/g, '')).toLocaleString('en-IN');
  }

  function getFeatures() {
    const nodes = document.querySelectorAll(
      '#feature-bullets ul li span.a-list-item, #feature-bullets .a-list-item'
    );
    const features = [];

    for (const node of nodes) {
      const text = cleanText(node.textContent);
      if (text && !/^(see more|see less)$/i.test(text) && !features.includes(text)) {
        features.push(text);
      }
      if (features.length >= 6) break;
    }

    return features;
  }

  function extractProduct() {
    const title = firstText(['#productTitle']);
    const asin = getAsin();

    if (!asin || !title) {
      return {
        success: false,
        reason: 'This does not appear to be an Amazon product detail page. Open an individual product listing and try again.'
      };
    }

    const price = firstText([
      '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
      '#apex_desktop .a-price .a-offscreen',
      '#price_inside_buybox',
      '#priceblock_dealprice',
      '#priceblock_ourprice',
      '#priceblock_saleprice',
      '.a-price[data-a-color="price"] .a-offscreen'
    ]);

    const imageElement = document.querySelector('#landingImage, #imgBlkFront, #main-image');
    const image = imageElement?.getAttribute('data-old-hires') || imageElement?.getAttribute('src') || '';

    return {
      success: true,
      product: {
        asin,
        title,
        price: price || 'Not available on this page',
        rating: getRating(),
        reviewCount: getRatingCount(),
        brand: getBrand(),
        image,
        features: getFeatures(),
        url: window.location.href,
        extractedAt: new Date().toISOString()
      }
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'GET_PRODUCT_DATA') return false;

    try {
      sendResponse(extractProduct());
    } catch (error) {
      console.error('Shopping Assistant extraction error:', error);
      sendResponse({
        success: false,
        reason: 'The page could not be read. Refresh the Amazon page and try again.'
      });
    }

    return false;
  });
})();
