// api/price.js
// Обёртка над Jupiter Price API V3 (Beta)

/**
 * Хост: lite-api — free-тариф. Для Pro можно переключиться на https://api.jup.ag.
 * Docs: https://dev.jup.ag/docs/price/v3
 */
const PRICE_BASE_URL = "https://juplite-worker.videomessagetofuture.workers.dev/price/v3";

/**
 * Получить цены токенов.
 *
 * @param {string[]|string} ids - массив mint-адресов или одна строка
 * @returns {Promise<Object>} объект вида { [mint]: { price: number, ... } }
 */
export async function getPrices(ids) {
  let idsParam;

  if (Array.isArray(ids)) {
    if (!ids.length) throw new Error('getPrices: пустой массив ids');
    idsParam = ids.join(',');
  } else if (typeof ids === 'string') {
    idsParam = ids;
  } else {
    throw new Error('getPrices: ids должен быть строкой или массивом строк');
  }

  const params = new URLSearchParams({ ids: idsParam });
  const url = `${PRICE_BASE_URL}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Price API error: ${res.status} ${text}`);
  }

  // Ответ формата: { "<mint>": { price: ..., lastUpdatedAt: ..., ... }, ... }
  return res.json();
}

