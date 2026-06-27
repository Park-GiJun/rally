import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listHoldingsApi,
  addHoldingApi,
  removeHoldingApi,
  refreshPricesApi,
} from '../../api/stock';

export const STOCK_QUERY_KEY = ['stocks'] as const;

export function useStock() {
  const qc = useQueryClient();
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [avgCost, setAvgCost] = useState('');

  const query = useQuery({ queryKey: STOCK_QUERY_KEY, queryFn: listHoldingsApi });

  /** 변경 후 목록 + 대시보드 피드를 함께 갱신. */
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: STOCK_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };

  const add = useMutation({
    mutationFn: addHoldingApi,
    onSuccess: () => {
      setSymbol('');
      setName('');
      setShares('');
      setAvgCost('');
      invalidate();
    },
  });

  const remove = useMutation({ mutationFn: removeHoldingApi, onSuccess: invalidate });

  const refresh = useMutation({
    mutationFn: refreshPricesApi,
    onSuccess: (list) => {
      qc.setQueryData(STOCK_QUERY_KEY, list);
    },
  });

  // 약 5초마다 시세를 가볍게 갱신해 "실시간" 느낌을 준다.
  useEffect(() => {
    const timer = setInterval(() => refresh.mutate(), 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const holdings = query.data;

  const totals = useMemo(() => {
    const list = holdings ?? [];
    const value = list.reduce((sum, h) => sum + h.price * h.shares, 0);
    const cost = list.reduce((sum, h) => sum + h.avgCost * h.shares, 0);
    const profit = value - cost;
    const profitPct = cost > 0 ? (profit / cost) * 100 : 0;
    return { value, cost, profit, profitPct };
  }, [holdings]);

  const sharesValue = Number(shares);
  const avgCostValue = Number(avgCost);
  const canSubmit =
    symbol.trim().length > 0 &&
    name.trim().length > 0 &&
    Number.isFinite(sharesValue) &&
    sharesValue > 0 &&
    Number.isFinite(avgCostValue) &&
    avgCostValue > 0;

  const submit = () => {
    if (!canSubmit) return;
    add.mutate({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      shares: sharesValue,
      avgCost: avgCostValue,
    });
  };

  return {
    holdings,
    isLoading: query.isLoading,
    isError: query.isError,
    totals,
    symbol,
    setSymbol,
    name,
    setName,
    shares,
    setShares,
    avgCost,
    setAvgCost,
    canSubmit,
    submit,
    isSubmitting: add.isPending,
    remove: (id: number) => remove.mutate(id),
    refresh: () => refresh.mutate(),
    isRefreshing: refresh.isPending,
  };
}
