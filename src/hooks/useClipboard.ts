import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), timeout);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [timeout]);

  return {
    copySuccess,
    copyToClipboard
  };
}