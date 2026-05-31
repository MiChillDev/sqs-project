import { useCallback, useState } from 'react';

export function useBanner(): [string | null, (v: string | null) => void] {
  const [key, setKey] = useState<string | null>(null);

  const setBannerKey = useCallback((v: string | null) => {
    setKey(v);
  }, []);

  return [key, setBannerKey] as const;
}
