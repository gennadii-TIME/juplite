// api/tokens.js
// Обёртка над Jupiter Tokens API V2 (search / tag / category / recent)
// Docs: https://dev.jup.ag/docs/tokens/v2

const TOKENS_BASE_URL = "https://juplite-worker.videomessagetofuture.workers.dev/tokens/v2";

/**
 * Поиск токена по имени, символу или mint.
 *
 * @param {string} query
 * @returns {Promise<Array>} массив токенов с данными (name, symbol, icon, decimals, organicScore, isVerified, ...)
 */
export async function searchTokens(query) {
  if (!query) throw new Error('searchTokens: пустой query');

  const params = new URLSearchParams({ query });
  const url = `${TOKENS_BASE_URL}/search?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Tokens /search error: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Получить токены по тегу.
 *
 * @param {'verified'|'lst'} tag
 */
export async function getTokensByTag(tag = 'verified') {
  const params = new URLSearchParams({ query: tag });
  const url = `${TOKENS_BASE_URL}/tag?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Tokens /tag error: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Получить токены по категории (toporganicscore / toptraded / toptrending).
 *
 * @param {'toporganicscore'|'toptraded'|'toptrending'} category
 * @param {'5m'|'1h'|'6h'|'24h'} [interval='24h']
 * @param {number} [limit=50]
 */
export async function getTokensByCategory(
  category = 'toporganicscore',
  interval = '24h',
  limit = 50,
) {
  const url = `${TOKENS_BASE_URL}/${category}/${interval}?limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Tokens /${category} error: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Получить "свежие" токены (recent).
 *
 * @param {number} [limit] - если нужно переопределить дефолт (по умолчанию ~30)
 */
export async function getRecentTokens(limit) {
  const url =
    typeof limit === 'number'
      ? `${TOKENS_BASE_URL}/recent?limit=${limit}`
      : `${TOKENS_BASE_URL}/recent`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Tokens /recent error: ${res.status} ${text}`);
  }

  return res.json();
}

