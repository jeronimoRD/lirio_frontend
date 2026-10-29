import { useState } from 'react';
import { useRouter } from 'expo-router';

import {
  createGarmentType,
  deleteGarmentType,
  updateGarmentType,
} from '../../api/garmentTypes';
import { useGarmentTypes } from '../../garment-types/context';
import type { GarmentType } from '../../types';

export const GARMENT_TYPE_NAME_MIN_LENGTH = 2;
export const GARMENT_TYPE_NAME_MAX_LENGTH = 50;

export function useAdminGarmentTypes() {
  const router = useRouter();
  const { types, loaded, refresh } = useGarmentTypes();

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

  const filteredTypes = types.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
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

    if (name.length < GARMENT_TYPE_NAME_MIN_LENGTH) {
      setNameError(`Mínimo ${GARMENT_TYPE_NAME_MIN_LENGTH} caracteres para crear el tipo`);
      return;
    }

    if (name.length > GARMENT_TYPE_NAME_MAX_LENGTH) {
      setNameError(`Máximo ${GARMENT_TYPE_NAME_MAX_LENGTH} caracteres para crear el tipo`);
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
      await createGarmentType(name);
      setNewName('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el tipo de prenda');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (type: GarmentType) => {
    setEditingId(type.id);
    setEditName(type.name);
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
      await updateGarmentType(editingId, name);
      setEditingId(null);
      setEditName('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el tipo de prenda');
    } finally {
      setBusyId(null);
    }
  };

  const requestDelete = (type: GarmentType) => {
    if (busyId) return;

    setError(null);
    setConfirmDeleteId(type.id);
  };

  const onDelete = async () => {
    const id = confirmDeleteId;

    if (!id || busyId) return;

    setBusyId(id);
    setConfirmDeleteId(null);
    setError(null);

    try {
      await deleteGarmentType(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el tipo de prenda');
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
    types,
    filteredTypes,
    loading: !loaded,
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

    maxNameLength: GARMENT_TYPE_NAME_MAX_LENGTH,
    goBack,
  };
}
