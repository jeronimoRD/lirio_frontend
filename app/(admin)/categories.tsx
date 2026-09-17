import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../src/api/categories';
import Button from '../../src/components/Button';
import type { Category } from '../../src/types';

const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.10)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  shadowOpacity: 1,
  elevation: 2,
};

export default function AdminCategories() {
  const insets = useSafeAreaInsets();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

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
        current.map((c) => (c.id === editingId ? { ...c, name } : c)),
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
      setCategories((current) => current.filter((c) => c.id !== category.id));
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
      className="flex-1 bg-[#FCFAF8]"
      contentContainerClassName="px-5 py-8"
      contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
    >
      <View className="mx-auto w-full max-w-md">
        <View className="mb-6 flex-row items-center gap-2">
          <Text className="text-[22px] font-bold uppercase tracking-wide text-[#292724]">
            Categorías
          </Text>
          <View className="rounded-full bg-[#4A3728] px-2 py-0.5">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
              Admin
            </Text>
          </View>
        </View>

        {error && (
          <View className="mb-4 rounded-2xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {error}
            </Text>
          </View>
        )}

        <View className="flex-row gap-2">
          <TextInput
            className="h-12 flex-1 rounded-xl border border-[#EAE6E1] bg-white px-4 text-sm text-[#292724]"
            value={newName}
            onChangeText={setNewName}
            maxLength={50}
            placeholder="Nueva categoría"
            placeholderTextColor="#A09B95"
            autoCapitalize="words"
            onSubmitEditing={onCreate}
          />
          <View className="w-28">
            <Button
              text={creating ? '...' : 'Agregar'}
              onPress={onCreate}
              disabled={creating || newName.trim() === ''}
              className="h-12 rounded-xl bg-[#4A3728] px-4 py-0"
            />
          </View>
        </View>

        <View className="mt-4 h-12 flex-row items-center gap-2 rounded-full border border-[#EAE6E1] bg-white px-4">
          <Search size={18} color="#A09B95" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar categoría..."
            placeholderTextColor="#A09B95"
            className="flex-1 text-sm text-[#292724]"
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color="#A09B95" />
            </Pressable>
          )}
        </View>

        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator color="#4A3728" />
          </View>
        )}

        {!loading && !error && categories.length === 0 && (
          <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
            <Text className="text-center text-sm text-[#6E6B68]">
              Aún no hay categorías. Crea la primera arriba.
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          categories.length > 0 &&
          filteredCategories.length === 0 && (
            <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
              <Text className="text-center text-sm text-[#6E6B68]">
                No se encontraron categorías para {`"${searchQuery}"`}.
              </Text>
            </View>
          )}

        {!loading &&
          filteredCategories.map((category) => {
            const isEditing = editingId === category.id;

            return (
              <View
                key={category.id}
                className="mt-4 rounded-2xl bg-white p-5"
                style={cardShadow}
              >
                {isEditing ? (
                  <>
                    <TextInput
                      className="h-12 rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4 text-sm text-[#292724]"
                      value={editName}
                      onChangeText={setEditName}
                      maxLength={50}
                      placeholder="Nombre de la categoría"
                      placeholderTextColor="#A09B95"
                      autoCapitalize="words"
                      onSubmitEditing={onSaveEdit}
                    />
                    <View className="mt-3 flex-row gap-2">
                      <View className="flex-1">
                        <Button
                          text={busyId === category.id ? 'Guardando...' : 'Guardar'}
                          onPress={onSaveEdit}
                          disabled={busyId !== null || editName.trim() === ''}
                          className="rounded-xl bg-[#4A3728]"
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
                      <Text className="flex-1 text-base font-semibold text-[#292724]">
                        {category.name}
                      </Text>
                      <Pressable onPress={() => onStartEdit(category)}>
                        <Text className="text-sm font-semibold text-[#4A3728]">
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
                        danger={confirmDeleteId === category.id}
                        secondary={confirmDeleteId !== category.id}
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