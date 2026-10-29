import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getGarmentTypes } from '../api/garmentTypes';
import type { GarmentType } from '../types';

type GarmentTypesValue = {
  types: GarmentType[];
  loaded: boolean;
  labelOf: (id: string | null | undefined) => string;
  refresh: () => Promise<void>;
};

const GarmentTypesContext = createContext<GarmentTypesValue | null>(null);

export function GarmentTypesProvider({ children }: { children: ReactNode }) {
  const [types, setTypes] = useState<GarmentType[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setTypes(await getGarmentTypes());
  }, []);

  useEffect(() => {
    refresh()
      .catch((error) => console.log('Error cargando tipos de prenda:', error))
      .finally(() => setLoaded(true));
  }, [refresh]);

  const value = useMemo<GarmentTypesValue>(
    () => ({
      types,
      loaded,
      labelOf: (id) => types.find((type) => type.id === id)?.name ?? '',
      refresh,
    }),
    [types, loaded, refresh],
  );

  return <GarmentTypesContext.Provider value={value}>{children}</GarmentTypesContext.Provider>;
}

export function useGarmentTypes(): GarmentTypesValue {
  const value = useContext(GarmentTypesContext);

  if (!value) {
    throw new Error('useGarmentTypes debe usarse dentro de GarmentTypesProvider');
  }

  return value;
}
