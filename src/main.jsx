import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function isAmazonProductUrl(urlString) {
  try {
    const url = new URL(urlString);
    const host = url.hostname.replace(/^www\./, '');
    return ['amazon.in', 'amazon.com'].includes(host);
  } catch {
    return false;
  }
}

function ProductDetails({ product }) {
  const [showFullTitle, setShowFullTitle] = useState(false);

  return (
    <>
      <div className="product-heading">
        <span className="eyebrow">DETECTED PRODUCT</span>
        <h2 className={showFullTitle ? 'expanded' : ''}>{product.title}</h2>
        {product.title.length > 105 && (
          <button
            className="text-button"
            type="button"
            onClick={() => setShowFullTitle((current) => !current)}
            aria-expanded={showFullTitle}
          >
            {showFullTitle ? 'Show less' : 'Show full title'}
          </button>
        )}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">PRICE</span>
          <strong>{product.price}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">RATING</span>
          <strong>{product.rating}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">RATINGS COUNT</span>
          <strong>{product.reviewCount}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">BRAND</span>
          <strong>{product.brand}</strong>
        </div>
      </div>

      <div className="detail-row">
        <span>ASIN</span>
        <code>{product.asin}</code>
      </div>

      <div className="features-section">
        <div className="section-title">KEY FEATURES</div>
        {product.features.length ? (
          <ul>
            {product.features.map((feature, index) => <li key={`${index}-${feature}`}>{feature}</li>)}
          </ul>
        ) : (
          <p className="muted small">No feature bullets were found on this page.</p>
        )}
      </div>

      <a className="product-link" href={product.url} target="_blank" rel="noreferrer">
        View product on Amazon <span aria-hidden="true">↗</span>
      </a>
      <p className="fine-print">Details are read from the currently open listing. Verify price and availability on Amazon.</p>
    </>
  );
}

function App() {
  const [state, setState] = useState({ status: 'loading', product: null, message: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  const inspectActiveTab = useCallback(async () => {
    setState({ status: 'loading', product: null, message: '' });

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id || !isAmazonProductUrl(tab.url || '')) {
        setState({
          status: 'empty',
          product: null,
          message: 'Open an Amazon.in or Amazon.com product page, then open this extension again.'
        });
        return;
      }

      chrome.tabs.sendMessage(tab.id, { type: 'GET_PRODUCT_DATA' }, (response) => {
        const runtimeError = chrome.runtime.lastError;
        if (runtimeError) {
          setState({
            status: 'error',
            product: null,
            message: 'The page script is not ready. Refresh the Amazon product page and reopen the extension.'
          });
          return;
        }

        if (!response?.success) {
          setState({
            status: 'empty',
            product: null,
            message: response?.reason || 'No product information was found on this page.'
          });
          return;
        }

        setState({ status: 'success', product: response.product, message: '' });
      });
    } catch (error) {
      setState({
        status: 'error',
        product: null,
        message: 'Could not inspect this tab. Close and reopen the extension, then try again.'
      });
    }
  }, []);

  useEffect(() => {
    inspectActiveTab();
  }, [inspectActiveTab, refreshKey]);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">S</div>
        <div className="brand-copy">
          <h1>Shopwise</h1>
          <p>AMAZON SHOPPING ASSISTANT</p>
        </div>
        <span className="phase-tag">PHASE 1</span>
      </header>

      <div className="status-line">
        <span className={`status-dot ${state.status}`} />
        {state.status === 'loading' ? 'Reading current page' : state.status === 'success' ? 'Product detected' : 'Waiting for product page'}
      </div>

      {state.status === 'loading' && (
        <section className="message-panel" aria-live="polite">
          <div className="loader" />
          <p>Checking the open Amazon page…</p>
        </section>
      )}

      {(state.status === 'empty' || state.status === 'error') && (
        <section className="message-panel" aria-live="polite">
          <div className="message-icon">{state.status === 'error' ? '!' : '↗'}</div>
          <h2>No product data yet</h2>
          <p>{state.message}</p>
          <button className="primary-button" onClick={() => setRefreshKey((value) => value + 1)}>
            Try again
          </button>
        </section>
      )}

      {state.status === 'success' && <ProductDetails product={state.product} />}

      <footer className="app-footer">
        <span>LOCAL PAGE EXTRACTION</span>
        <span>·</span>
        <span>NO ACCOUNT REQUIRED</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
