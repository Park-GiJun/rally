import type { Holding, AddHoldingBody } from '../types/stock';
import { loadList, saveList, nextId, delay } from './demoStore';
import { appendDemoActivity } from './demoFeed';

const KEY = 'stock';

function seed(): Holding[] {
  return [
    { id: 1, symbol: 'NVDA', name: '엔비디아', price: 132.5, changePct: 2.4, shares: 10, avgCost: 95.2 },
    { id: 2, symbol: 'AAPL', name: '애플', price: 224.8, changePct: -0.8, shares: 5, avgCost: 198.4 },
    { id: 3, symbol: 'TSLA', name: '테슬라', price: 251.3, changePct: 1.2, shares: 8, avgCost: 270.5 },
    { id: 4, symbol: '005930', name: '삼성전자', price: 58200, changePct: -1.1, shares: 30, avgCost: 61000 },
  ];
}

export async function listDemoHoldings(): Promise<Holding[]> {
  return delay(loadList(KEY, seed));
}

export async function addDemoHolding(body: AddHoldingBody): Promise<Holding> {
  const list = loadList(KEY, seed);
  const holding: Holding = {
    id: nextId(list),
    symbol: body.symbol,
    name: body.name,
    price: body.avgCost,
    changePct: 0,
    shares: body.shares,
    avgCost: body.avgCost,
  };
  saveList(KEY, [holding, ...list]);
  appendDemoActivity({
    type: 'PRICE_ALERT',
    payload: { symbol: body.symbol, note: '관심종목 추가', changePct: 0 },
  });
  return delay(holding);
}

export async function removeDemoHolding(id: number): Promise<void> {
  const list = loadList(KEY, seed);
  saveList(KEY, list.filter((h) => h.id !== id));
  return delay(undefined);
}

/**
 * 시세 갱신 시뮬레이션 — 종목마다 id·현재가로 결정되는 미세 변동(-1.5%~+1.5%)을 적용한다.
 * Math.random 을 쓰지 않으므로 같은 상태에서는 항상 같은 결과(결정적)다.
 */
export async function tickDemoPrices(): Promise<Holding[]> {
  const list = loadList(KEY, seed);
  const updated = list.map((h) => {
    const noise = (h.id * 31 + Math.round(h.price * 100)) % 31; // 0..30
    const delta = (noise - 15) / 10; // -1.5 .. 1.5 (%)
    const price = Math.max(1, Math.round(h.price * (1 + delta / 100) * 100) / 100);
    return { ...h, price, changePct: Math.round(delta * 100) / 100 };
  });
  saveList(KEY, updated);
  return delay(updated);
}
