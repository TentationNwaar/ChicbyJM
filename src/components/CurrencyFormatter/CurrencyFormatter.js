import React from 'react';

const KNOWN_CURRENCIES = ['USD', 'EUR', 'CHF', 'GBP', 'CAD', 'AUD'];

function parseAmountAndCurrency(input, fallbackCurrency = 'USD') {
  if (typeof input === 'number' && Number.isFinite(input)) {
    return { amount: input, currency: fallbackCurrency };
  }

  if (typeof input === 'string') {
    const str = input.trim();

    // Detect currency code if present in the string
    const foundCurrency =
      KNOWN_CURRENCIES.find((c) => new RegExp(`\\b${c}\\b`, 'i').test(str)) ||
      null;

    // Extract numeric portion (supports comma or dot decimals)
    const match = str.replace(',', '.').match(/(\d+(?:\.\d+)?)/);
    const numeric = match ? parseFloat(match[1]) : NaN;

    if (!Number.isNaN(numeric)) {
      return {
        amount: numeric,
        currency: (foundCurrency || fallbackCurrency).toUpperCase(),
      };
    }
  }

  return null; // invalid input
}

const CurrencyFormatter = ({
  amount,
  currency = 'CHF',
  appendZero = false,
  useDollar = false,
}) => {
  // Normalize input (number or string like "29.90 CHF")
  const parsed = parseAmountAndCurrency(amount, currency);
  if (!parsed) return null; // no fallback text

  const displayAmount = parsed.amount;
  const displayCurrency = parsed.currency;

  const languageCode =
    typeof window !== 'undefined'
      ? window.navigator.language || 'fr-CH'
      : 'fr-CH';

  const formatObject = new Intl.NumberFormat(languageCode, {
    style: 'currency',
    currency: displayCurrency,
  });

  let formattedPrice = formatObject.format(displayAmount);

  if ('formatToParts' in formatObject) {
    const parts = formatObject.formatToParts(displayAmount);

    // Choose symbol from parts when possible
    const currencyPart = parts.find((p) => p.type === 'currency');
    const decimalPart = parts.find((p) => p.type === 'decimal');
    const fractionPart = parts.find((p) => p.type === 'fraction');

    if (currencyPart) {
      // remove the currency code/symbol text from the formatted price body
      formattedPrice = formattedPrice.replace(currencyPart.value, '').trim();
    }

    // Optionally remove trailing .00 (or locale decimal) if appendZero === false
    if (fractionPart && fractionPart.value === '00' && !appendZero) {
      const dec = decimalPart?.value || '.';
      const trailing = `${dec}${fractionPart.value}`;
      if (formattedPrice.endsWith(trailing)) {
        formattedPrice = formattedPrice.slice(0, -trailing.length);
      }
    }
  }

  return (
    <>
      <span>{formattedPrice}</span>
      <span>&nbsp;{displayCurrency}</span>
    </>
  );
};

export default CurrencyFormatter;
