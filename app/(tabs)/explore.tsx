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
import type { Post } from '../../src/types';
import ScreenHeader from '@/components/ScreenHeader';

const FILTERS = ['Streetwear', 'Classy', 'Vintage', 'Minimal', 'Boho'];

export default function Explore() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    useEffect(() => {
        let active = true;

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

        return () => {
        active = false;
        };
    }, []);

    const toggleFilter = (filter: string) => {
        setActiveFilters((prev) =>
        prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
        );
    };

    // Búsqueda real: filtra por título o descripción.
    // TODO: los chips de categoría (Streetwear, Classy...) no filtran nada
    // real todavía porque Post no tiene ese campo en el backend.
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return posts;

        return posts.filter((post) => {
        const haystack = `${post.title} ${post.description ?? ''}`.toLowerCase();
        return haystack.includes(q);
        });
    }, [posts, query]);

    const leftColumn = results.filter((_, i) => i % 2 === 0);
    const rightColumn = results.filter((_, i) => i % 2 === 1);

    return (
        <View className="flex-1 bg-[#FCFAF8]">
        {/* Header */}
        <ScreenHeader title="Busca tu estilo" />

        <ScrollView
            className="flex-1"
            contentContainerClassName="pb-24"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Barra de búsqueda real */}
            <View className="px-4 pt-4">
            <View className="h-12 flex-row items-center gap-2 rounded-full border border-[#EAE6E1] bg-white px-4">
                <Search size={18} color="#A09B95" />
                <TextInput
                value={query}
                onChangeText={setQuery}
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

            {/* Chips de categoría */}
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4 py-4"
            >
            {FILTERS.map((filter) => {
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

            {!loading && !error && results.length === 0 && (
            <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
                <Text className="text-center text-sm text-[#6E6B68]">
                {query
                    ? `Sin resultados para "${query}"`
                    : 'Aún no hay outfits publicados.'}
                </Text>
            </View>
            )}

            {/* Resultados en masonry */}
            {!loading && !error && results.length > 0 && (
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
                        <Text numberOfLines={1} className="text-[11px] font-semibold text-white">
                            {post.title}
                        </Text>
                        </View>
                    </View>
                    ))}
                </View>
                ))}
            </View>
            )}
        </ScrollView>
        </View>
    );
}