import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listEntriesApi,
  createEntryApi,
  removeEntryApi,
} from '../../api/ledger';
import type { LedgerKind } from '../../types/ledger';

export const LEDGER_QUERY_KEY = ['ledger'] as const;

/** 오늘 날짜 YYYY-MM-DD. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useLedger() {
  const qc = useQueryClient();
  const [kind, setKind] = useState<LedgerKind>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(today());

  const query = useQuery({ queryKey: LEDGER_QUERY_KEY, queryFn: listEntriesApi });

  /** 변경 후 목록 + 대시보드 피드를 함께 갱신. */
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: LEDGER_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ['feed'] });
  };

  const create = useMutation({
    mutationFn: createEntryApi,
    onSuccess: () => {
      setAmount('');
      setCategory('');
      setMemo('');
      invalidate();
    },
  });

  const remove = useMutation({ mutationFn: removeEntryApi, onSuccess: invalidate });

  const entries = query.data;

  const summary = useMemo(() => {
    const list = entries ?? [];
    const income = list
      .filter((e) => e.kind === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    const expense = list
      .filter((e) => e.kind === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    return { income, expense, net: income - expense };
  }, [entries]);

  const amountValue = Number(amount);
  const canSubmit =
    Number.isFinite(amountValue) && amountValue > 0 && category.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    create.mutate({
      kind,
      amount: Math.round(amountValue),
      category: category.trim(),
      memo: memo.trim() || undefined,
      date,
    });
  };

  return {
    entries,
    isLoading: query.isLoading,
    isError: query.isError,
    summary,
    kind,
    setKind,
    amount,
    setAmount,
    category,
    setCategory,
    memo,
    setMemo,
    date,
    setDate,
    canSubmit,
    submit,
    isSubmitting: create.isPending,
    remove: (id: number) => remove.mutate(id),
  };
}
