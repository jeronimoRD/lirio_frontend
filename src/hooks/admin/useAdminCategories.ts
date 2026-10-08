import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../api/categories';
import type { Category } from '../../types';

export const CATEGORY_NAME_MIN_LENGTH = 2;
export const CATEGORY_NAME_MAX_LENGTH = 50;

export function useAdminCategories() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las categorías');
    }
  };

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las categorías')
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const changeNewName = (text: string) => {
    setNewName(text);
    setNameError(null);
  };

  const clearSearch = () => setSearchQuery('');

  const cancelCreate = () => setConfirmCreate(false);

  const requestCreate = () => {
    const name = newName.trim();

    if (!name || creating || confirmCreate) return;

    if (name.length < CATEGORY_NAME_MIN_LENGTH) {
      setNameError(`Mínimo ${CATEGORY_NAME_MIN_LENGTH} caracteres para crear la categoría`);
      return;
    }

    if (name.length > CATEGORY_NAME_MAX_LENGTH) {
      setNameError(`Máximo ${CATEGORY_NAME_MAX_LENGTH} caracteres para crear la categoría`);
      return;
    }

    setNameError(null);
    setConfirmCreate(true);
  };

  const onCreate = async () => {
    const name = newName.trim();

    if (!name || creating) return;

    setConfirmCreate(false);
    setCreating(true);
    setError(null);

    try {
      await createCategory(name);
      setNewName('');
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la categoría');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async () => {
    const name = editName.trim();

    if (!editingId || !name || busyId) return;

    setBusyId(editingId);
    setError(null);

    try {
      await updateCategory(editingId, name);
      setEditingId(null);
      setEditName('');
      setCategories((current) => current.map((c) => (c.id === editingId ? { ...c, name } : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la categoría');
    } finally {
      setBusyId(null);
    }
  };

  const requestDelete = (category: Category) => {
    if (busyId) return;

    setError(null);
    setConfirmDeleteId(category.id);
  };

  const onDelete = async () => {
    const id = confirmDeleteId;

    if (!id || busyId) return;

    setBusyId(id);
    setConfirmDeleteId(null);
    setError(null);

    try {
      await deleteCategory(id);
      setCategories((current) => current.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la categoría');
    } finally {
      setBusyId(null);
    }
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(admin)');
  };

  return {
    categories,
    filteredCategories,
    loading,
    error,

    searchQuery,
    setSearchQuery,
    clearSearch,

    newName,
    changeNewName,
    nameError,
    confirmCreate,
    creating,
    requestCreate,
    onCreate,
    cancelCreate,

    editingId,
    editName,
    setEditName,
    startEdit,
    saveEdit,
    cancelEdit,

    busyId,
    confirmDeleteId,
    requestDelete,
    onDelete,
    cancelDelete,

    maxNameLength: CATEGORY_NAME_MAX_LENGTH,
    goBack,
  };
}
