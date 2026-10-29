import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { createUser, deleteUser, getAdminUsers, updateUserRole } from '../../api/admin';
import { useSession } from '../../session/context';
import type { Role, User } from '../../types';

type CreateForm = {
  name: string;
  email: string;
  password: string;
};

export function useAdminUsers() {
  const { user: me } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newRole, setNewRole] = useState<Role>('USER');
  const [submitting, setSubmitting] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [pendingCreate, setPendingCreate] = useState<CreateForm | null>(null);
  const [query, setQuery] = useState('');

  const filteredUsers = users.filter((user) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q);
  });

  const { control, handleSubmit, reset } = useForm<CreateForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios');
    }
  };

  useEffect(() => {
    getAdminUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios')
      )
      .finally(() => setLoading(false));
  }, []);

  const toggleCreate = () => setShowCreate((current) => !current);

  const requestCreate = () => {
    handleSubmit((data) => setPendingCreate(data))();
  };

  const onCreate = async () => {
    if (!pendingCreate) return;

    const data = pendingCreate;
    setPendingCreate(null);
    setSubmitting(true);
    setError(null);

    try {
      await createUser(data.name, data.email, data.password, newRole);
      setShowCreate(false);
      reset();
      setNewRole('USER');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const onToggleRole = async (user: User) => {
    if (busyId || user.id === me?.id) return;

    const nextRole: Role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setBusyId(user.id);
    setError(null);

    try {
      await updateUserRole(user.id, nextRole);
      setUsers((current) => current.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el rol del usuario');
    } finally {
      setBusyId(null);
    }
  };

  const requestDelete = (user: User) => {
    if (busyId || user.id === me?.id) return;

    setPendingDelete(user);
  };

  const onDelete = async () => {
    if (!pendingDelete || busyId) return;

    const target = pendingDelete;
    setPendingDelete(null);
    setBusyId(target.id);
    setError(null);

    try {
      await deleteUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el usuario');
    } finally {
      setBusyId(null);
    }
  };

  const cancelCreate = () => setPendingCreate(null);

  const cancelDelete = () => setPendingDelete(null);

  return {
    meId: me?.id ?? null,
    users,
    filteredUsers,
    loading,
    error,
    showCreate,
    newRole,
    setNewRole,
    submitting,
    busyId,
    pendingDelete,
    pendingCreate,
    query,
    setQuery,
    control,
    toggleCreate,
    requestCreate,
    onCreate,
    onToggleRole,
    requestDelete,
    onDelete,
    cancelCreate,
    cancelDelete,
  };
}
