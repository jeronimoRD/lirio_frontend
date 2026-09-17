import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Search, X } from 'lucide-react-native';

import { getPosts } from '../../src/api/posts';
import { getCategories } from '../../src/api/categories';
import { searchUsers, suggestUsers } from '../../src/api/users';
import type { Post, Category, User } from '../../src/types';
import ScreenHeader from '@/components/ScreenHeader';

type SearchTab = 'outfits' | 'cuentas';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<SearchTab>('outfits');
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    let active = true;

    getCategories()
      .then((all) => {
        if (active) setCategories(all);
      })
      .catch(() => {});

    getPosts()
      .then((all) => {
        if (active) setPosts(all);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar el contenido');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    suggestUsers(3)
      .then((all) => {
        if (active) setSuggestions(all);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Búsqueda de cuentas en el servidor, con un pequeño retardo.
  useEffect(() => {
    const q = query.trim();

    let active = true;

    const timer = setTimeout(() => {
      if (!active) return;

      if (!q) {
        setUsers([]);
        setUsersError(null);
        setUsersLoading(false);
        return;
      }

      setUsersLoading(true);
      setUsersError(null);

      searchUsers(q)
        .then((data) => {
          if (active) setUsers(data);
        })
        .catch((err) => {
          if (active) {
            setUsersError(
              err instanceof Error
                ? err.message
                : 'No se pudieron buscar cuentas',
            );
          }
        })
        .finally(() => {
          if (active) setUsersLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
    );
  };

  // Filtra por título o descripción del post.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((post) => {
      const haystack = `${post.title} ${post.description ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query]);

  const hasQuery = query.trim().length > 0;
  const searchActive = focused || hasQuery;

  const outfitCountByUser = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.userId, (counts.get(post.userId) ?? 0) + 1);
    }
    return counts;
  }, [posts]);

  const filters = categories.map((category) => category.name);

  const leftColumn = results.filter((_, i) => i % 2 === 0);
  const rightColumn = results.filter((_, i) => i % 2 === 1);

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScreenHeader title="Busca tu estilo" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Barra de búsqueda */}
        <View className="px-4 pt-4">
          <View className="h-12 flex-row items-center gap-2 rounded-full border border-[#EAE6E1] bg-white px-4">
            <Search size={18} color="#A09B95" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                if (!query.trim()) setActiveTab('outfits');
              }}
              placeholder="Buscar outfits, estilos..."
              placeholderTextColor="#A09B95"
              className="flex-1 text-sm text-[#292724]"
              autoCapitalize="none"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <X size={16} color="#A09B95" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Pestañas: Outfits | Cuentas (solo al presionar el buscador) */}
        {searchActive && (
          <View className="px-4 pt-4">
            <View className="flex-row rounded-full border border-[#EAE6E1] bg-white p-1">
              <TabButton
                label="Outfits"
                active={activeTab === 'outfits'}
                onPress={() => setActiveTab('outfits')}
              />
              <TabButton
                label="Cuentas"
                active={activeTab === 'cuentas'}
                onPress={() => setActiveTab('cuentas')}
              />
            </View>
          </View>
        )}

        {activeTab === 'outfits' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4 py-4"
          >
            {filters.map((filter) => {
              const active = activeFilters.includes(filter);
              return (
                <Pressable
                  key={filter}
                  onPress={() => toggleFilter(filter)}
                  className={`items-center justify-center rounded-full px-4 py-2 ${
                    active ? 'bg-[#DCC7A8]' : 'border border-[#EAE6E1]'
                  }`}
                >
                  <Text
                    className={`text-[13px] font-semibold ${
                      active ? 'text-[#292724]' : 'text-[#6E6B68]'
                    }`}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {error && (
          <View className="mx-4 rounded-xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
          </View>
        )}

        {loading && (
          <View className="items-center py-16">
            <ActivityIndicator color="#A81245" />
          </View>
        )}

        {!loading && !error && !searchActive && (
          <View className="gap-7">
            {/* Sugerencias de cuentas al entrar */}
            {suggestions.length > 0 && (
              <View>
                <Text className="mb-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[#6E6B68]">
                  Cuentas para ti
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-3 px-4"
                >
                  {suggestions.map((user) => (
                    <SuggestionCard
                      key={user.id}
                      user={user}
                      outfitCount={outfitCountByUser.get(user.id) ?? 0}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {results.length > 0 ? (
              <View className="flex-row gap-3 px-4">
                {[leftColumn, rightColumn].map((column, colIndex) => (
                  <View key={colIndex} className="flex-1 gap-3">
                    {column.map((post) => (
                      <View key={post.id} className="overflow-hidden rounded-[14px]">
                        <Image
                          source={{ uri: post.image }}
                          className="w-full"
                          style={{ height: 200 }}
                          resizeMode="cover"
                        />
                        <View className="absolute bottom-0 left-0 right-0 bg-black/30 px-2 py-1.5">
                          <Text
                            numberOfLines={1}
                            className="text-[11px] font-semibold text-white"
                          >
                            {post.title}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
                <Text className="text-center text-sm text-[#6E6B68]">
                  Aún no hay outfits publicados.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Búsqueda activa: outfits */}
        {!loading && !error && searchActive && activeTab === 'outfits' && (
          <View className="gap-7">
            {results.length > 0 ? (
              <View className="flex-row gap-3 px-4">
                {[leftColumn, rightColumn].map((column, colIndex) => (
                  <View key={colIndex} className="flex-1 gap-3">
                    {column.map((post) => (
                      <View key={post.id} className="overflow-hidden rounded-[14px]">
                        <Image
                          source={{ uri: post.image }}
                          className="w-full"
                          style={{ height: 200 }}
                          resizeMode="cover"
                        />
                        <View className="absolute bottom-0 left-0 right-0 bg-black/30 px-2 py-1.5">
                          <Text
                            numberOfLines={1}
                            className="text-[11px] font-semibold text-white"
                          >
                            {post.title}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : hasQuery ? (
              <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
                <Text className="text-center text-sm text-[#6E6B68]">
                  {`Sin resultados para "${query}"`}
                </Text>
              </View>
            ) : (
              <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
                <Text className="text-center text-sm text-[#6E6B68]">
                  Escribe para buscar outfits.
                </Text>
              </View>
            )}
          </View>
        )}

        {!loading && !error && searchActive && activeTab === 'cuentas' && (
          <View className="gap-3">
            {hasQuery ? (
              <>
                {usersLoading && (
                  <View className="items-center py-8">
                    <ActivityIndicator color="#A81245" />
                  </View>
                )}

                {users.length > 0 &&
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      outfitCount={outfitCountByUser.get(user.id) ?? 0}
                    />
                  ))}

                {usersError && (
                  <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
                    <Text className="text-center text-sm text-red-700">
                      {usersError}
                    </Text>
                  </View>
                )}

                {!usersLoading && !usersError && users.length === 0 && (
                  <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
                    <Text className="text-center text-sm text-[#6E6B68]">
                      {`Sin cuentas para "${query}"`}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text className="px-4 pt-2 text-[11px] font-bold uppercase tracking-widest text-[#6E6B68]">
                  Escribe para buscar cuentas
                </Text>
                {suggestions.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    outfitCount={outfitCountByUser.get(user.id) ?? 0}
                  />
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center justify-center rounded-full py-2 ${
        active ? 'bg-[#A81245]' : ''
      }`}
    >
      <Text
        className={`text-[13px] font-semibold ${
          active ? 'text-white' : 'text-[#6E6B68]'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SuggestionCard({
  user,
  outfitCount,
}: {
  user: User;
  outfitCount: number;
}) {
  return (
    <View className="w-[150px] items-center gap-2 rounded-2xl border border-[#EAE6E1] bg-white p-4">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-[#DCC7A8]">
        <Text className="text-lg font-bold text-white">
          {initialsOf(user.name)}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        className="w-full text-center font-['Lora-Regular'] text-sm text-[#292724]"
      >
        {user.name}
      </Text>
      <Text className="text-[11px] font-semibold text-[#6E6B68]">
        {outfitCount} {outfitCount === 1 ? 'outfit' : 'outfits'}
      </Text>
    </View>
  );
}

function UserRow({ user, outfitCount }: { user: User; outfitCount: number }) {
  return (
    <View className="mx-4 mb-2 flex-row items-center gap-3 rounded-2xl border border-[#EAE6E1] bg-white p-3">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#DCC7A8]">
        <Text className="text-sm font-bold text-white">
          {initialsOf(user.name)}
        </Text>
      </View>
      <View className="flex-1 gap-[3px]">
        <Text
          numberOfLines={1}
          className="font-['Lora-Regular'] text-base text-[#292724]"
        >
          {user.name}
        </Text>
        {!!user.bio && (
          <Text numberOfLines={1} className="text-xs text-[#6E6B68]">
            {user.bio}
          </Text>
        )}
      </View>
      <View className="rounded-full bg-[#F4EEE7] px-3 py-1">
        <Text className="text-[11px] font-semibold text-[#6E6B68]">
          {outfitCount} {outfitCount === 1 ? 'outfit' : 'outfits'}
        </Text>
      </View>
    </View>
  );
}