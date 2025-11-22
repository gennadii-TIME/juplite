// api/ultra.js
// Базовый helper для работы с Jupiter Ultra Swap API (lite-api.jup.ag)

// Хост: на free-тарифе используем lite-api.
// Если подключишь Pro (api.jup.ag) — достаточно поменять BASE_URL.
const ULTRA_BASE_URL = 'https://lite-api.jup.ag/ultra/v1';

/**
 * Получить Ultra-ордер (quote + транзакция).
 *
 * @param {Object} params
 * @param {string} params.inputMint   - mint входного токена
 * @param {string} params.outputMint  - mint выходного токена
 * @param {string|number} params.amount - сумма в "нативных" единицах (без десятичных)
 * @param {string} params.taker       - публичный ключ кошелька пользователя
 * @param {string} [params.referralAccount] - адрес referralAccount (если используем Ultra Fees)
 * @param {number} [params.referralFee]     - реферальная комиссия в bps (50–255)
 * @param {string} [params.payer]           - адрес payer (для gasless, опционально)
 * @param {string} [params.closeAuthority]  - closeAuthority, если используем payer
 */
export async function getUltraOrder({
  inputMint,
  outputMint,
  amount,
  taker,
  referralAccount,
  referralFee,
  payer,
  closeAuthority,
}) {
  if (!inputMint || !outputMint || !amount) {
    throw new Error('getUltraOrder: inputMint, outputMint и amount обязательны');
  }

  // amount всегда как строка
  const inAmount = typeof amount === 'string' ? amount : String(amount);

  const searchParams = new URLSearchParams({
    inputMint,
    outputMint,
    amount: inAmount,
  });

  if (taker) searchParams.set('taker', taker);
  if (referralAccount) searchParams.set('referralAccount', referralAccount);
  if (typeof referralFee === 'number') {
    searchParams.set('referralFee', String(referralFee));
  }
  if (payer) searchParams.set('payer', payer);
  if (closeAuthority) searchParams.set('closeAuthority', closeAuthority);

  const url = `${ULTRA_BASE_URL}/order?${searchParams.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ultra /order error: ${res.status} ${text}`);
  }

  const json = await res.json();

  // Важные поля:
  // json.transaction — base64 unsigned tx
  // json.requestId   — нужен для /execute
  return json;
}

/**
 * Выполнить подписанную Ultra-транзакцию.
 *
 * @param {Object} params
 * @param {string} params.signedTransaction - base64 подписанной VersionedTransaction
 * @param {string} params.requestId         - requestId из ответа /order
 */
export async function executeUltraOrder({ signedTransaction, requestId }) {
  if (!signedTransaction || !requestId) {
    throw new Error('executeUltraOrder: signedTransaction и requestId обязательны');
  }

  const res = await fetch(`${ULTRA_BASE_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signedTransaction, requestId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ultra /execute error: ${res.status} ${text}`);
  }

  const json = await res.json();
  // json.status === 'Success' | 'Failed'
  // json.signature — tx hash для Solscan
  return json;
}

/**
 * Поиск токена через Ultra data endpoint `/ultra/v1/search`.
 * Можно использовать для селектора токенов прямо в JupLite.
 *
 * @param {string} query - символ, имя или mint токена
 */
export async function ultraSearchToken(query) {
  if (!query) throw new Error('ultraSearchToken: пустой query');

  const params = new URLSearchParams({ query });
  const url = `${ULTRA_BASE_URL}/search?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ultra /search error: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Получить балансы кошелька по Ultra `/holdings`.
 *
 * @param {string} owner - адрес кошелька
 */
export async function ultraGetHoldings(owner) {
  if (!owner) throw new Error('ultraGetHoldings: owner обязательный');

  const url = `${ULTRA_BASE_URL}/holdings/${owner}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ultra /holdings error: ${res.status} ${text}`);
  }

  return res.json();
}
