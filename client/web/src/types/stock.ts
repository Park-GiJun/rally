export interface Holding {
  id: number;
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  shares: number;
  avgCost: number;
}

export interface AddHoldingBody {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
}
