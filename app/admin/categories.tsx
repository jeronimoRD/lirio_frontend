import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../src/api/categories';
import Button from '../../src/components/Button';
import type { Category } from '../../src/types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
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
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las categorías',
      );
    }
  };

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
        setError(null);
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las categorías',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const onCreate = async () => {
    const name = newName.trim();

    if (!name || creating) return;

    setCreating(true);
    setError(null);

    try {
      await createCategory(name);
      setNewName('');
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo crear la categoría',
      );
    } finally {
      setCreating(false);
    }
  };

  const onStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const onSaveEdit = async () => {
    const name = editName.trim();

    if (!editingId || !name || busyId) return;

    setBusyId(editingId);
    setError(null);

    try {
      await updateCategory(editingId, name);
      setEditingId(null);
      setEditName('');
      setCategories((current) =>
        current.map((c) =>
          c.id === editingId ? { ...c, name } : c,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar la categoría',
      );
    } finally {
      setBusyId(null);
    }
  };

  const onDeletePress = async (category: Category) => {
    if (busyId) return;

    if (confirmDeleteId !== category.id) {
      setConfirmDeleteId(category.id);
      return;
    }

    setBusyId(category.id);
    setConfirmDeleteId(null);
    setError(null);

    try {
      await deleteCategory(category.id);
      setCategories((current) =>
        current.filter((c) => c.id !== category.id),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la categoría',
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 py-8"
    >
      <View className="mx-auto w-full max-w-md">
        <Text className="mb-6 text-3xl font-bold text-neutral-900">
          Categorías
        </Text>

        {error && (
          <View className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {error}
            </Text>
          </View>
        )}

        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-4"
            value={newName}
            onChangeText={setNewName}
            placeholder="Nueva categoría"
            autoCapitalize="words"
            onSubmitEditing={onCreate}
          />
          <View className="w-28">
            <Button
              text={creating ? '...' : 'Agregar'}
              onPress={onCreate}
              disabled={creating || newName.trim() === ''}
            />
          </View>
        </View>

        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator />
          </View>
        )}

        {!loading && !error && categories.length === 0 && (
          <View className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Text className="text-center text-sm text-neutral-500">
              Aún no hay categorías. Crea la primera arriba.
            </Text>
          </View>
        )}

        {!loading &&
          categories.map((category) => {
            const isEditing = editingId === category.id;

            return (
              <View
                key={category.id}
                className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                {isEditing ? (
                  <>
                    <TextInput
                      className="rounded-xl border border-neutral-300 bg-white px-4 py-3"
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Nombre de la categoría"
                      autoCapitalize="words"
                      onSubmitEditing={onSaveEdit}
                    />
                    <View className="mt-3 flex-row gap-2">
                      <View className="flex-1">
                        <Button
                          text={busyId === category.id ? 'Guardando...' : 'Guardar'}
                          onPress={onSaveEdit}
                          disabled={busyId !== null || editName.trim() === ''}
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          text="Cancelar"
                          secondary
                          onPress={() => {
                            setEditingId(null);
                            setEditName('');
                          }}
                          disabled={busyId !== null}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="flex-1 text-base font-semibold text-neutral-900">
                        {category.name}
                      </Text>
                      <Pressable onPress={() => onStartEdit(category)}>
                        <Text className="text-sm font-semibold text-green-600">
                          Renombrar
                        </Text>
                      </Pressable>
                    </View>

                    <View className="mt-4">
                      <Button
                        text={
                          confirmDeleteId === category.id
                            ? '¿Confirmar?'
                            : busyId === category.id
                              ? 'Eliminando...'
                              : 'Eliminar'
                        }
                        secondary
                        onPress={() => onDeletePress(category)}
                        disabled={busyId !== null}
                      />
                    </View>
                  </>
                )}
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
}