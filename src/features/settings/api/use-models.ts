'use client';

import { useMemo } from 'react';
import { useRuntimeStatus } from '@/features/settings/api/use-runtime-status';

export type ModelOption = {
  id: string;
  label: string;
  provider: string;
  source: 'runtime-default' | 'catalog' | 'session-history' | 'session-current';
};

export function useModelOptions(currentModel?: string, currentProvider?: string) {
  const runtimeQuery = useRuntimeStatus();

  const options = useMemo<ModelOption[]>(() => {
    const byId = new Map<string, ModelOption>();

    for (const option of runtimeQuery.data?.modelOptions ?? []) {
      byId.set(option.id, option);
    }

    if (currentModel && !byId.has(currentModel)) {
      byId.set(currentModel, {
        id: currentModel,
        label: currentModel,
        provider: currentProvider || runtimeQuery.data?.provider || 'unknown',
        source: 'session-current',
      });
    }

    if (!byId.size && runtimeQuery.data?.modelDefault) {
      byId.set(runtimeQuery.data.modelDefault, {
        id: runtimeQuery.data.modelDefault,
        label: runtimeQuery.data.modelDefault,
        provider: runtimeQuery.data.provider || 'unknown',
        source: 'runtime-default',
      });
    }

    return Array.from(byId.values());
  }, [currentModel, currentProvider, runtimeQuery.data?.modelDefault, runtimeQuery.data?.modelOptions, runtimeQuery.data?.provider]);

  return {
    ...runtimeQuery,
    data: options,
  };
}
