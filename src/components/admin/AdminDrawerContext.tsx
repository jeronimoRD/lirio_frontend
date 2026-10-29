import { createContext, useContext } from 'react';

const AdminDrawerContext = createContext<(() => void) | null>(null);

export function useAdminDrawer() {
  const openDrawer = useContext(AdminDrawerContext);

  if (!openDrawer) {
    throw new Error('useAdminDrawer debe usarse dentro del layout de administración');
  }

  return openDrawer;
}

export default AdminDrawerContext;
