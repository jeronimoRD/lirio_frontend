
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarClearance } from '../LiquidGlass/TabBarClearance';
import { Bookmark, Shirt, Settings2, LogOut, Sparkles } from 'lucide-react-native';

import ConfirmModal from '../ConfirmModal';
import FeedCard from '../FeedCard';
import ProfileCover from '@/components/LiquidGlass/ProfileCover';
import { garmentLabel } from '../upload/GarmentPicker';
import { GARMENT_TYPES, type GarmentType, type Post, type Role } from '../../types';
import { cardShadowLg } from '../../constants/theme';
import { initialsOf } from '../../utils/strings';
import { useProfile } from '../../hooks/tabs/useProfile';
import { useSaved } from '../../hooks/tabs/useSaved';

const COLORS = {
  background: '#FCFAF8',
  burgundy: '#A81245',
  text: '#292724',
  secondary: '#6E6B68',
  muted: '#A09B95',
  border: '#EAE6E1',
  champagne: '#DCC7A8',
  soft: '#F4EEE7',
  white: '#FFFFFF',
};

const ROLE_LABEL: Record<Role, string> = {
  USER: 'Usuario',
  ADMIN: 'Administrador',
};

export default function Profile({ active = true }: { active?: boolean }) {
  const insets = useSafeAreaInsets();
  const clearance = useTabBarClearance();
  const router = useRouter();

  const {
    user,
    signOut,
    posts,
    outfitCount,
    error,
    showSpinner,
    activeTab,
    setActiveTab,
    goToSettings,
    goToEditProfile,
    editPost,
    deleteTarget,
    deleting,
    askDelete,
    cancelDelete,
    onDeleteConfirmed,
  } = useProfile(active);

  const { savedPosts, loading: savedLoading, error: savedError } = useSaved();
  const [garmentType, setGarmentType] = useState<GarmentType | null>(null);

  if (!user) {
    return active ? <Redirect href="/(login)/login" /> : null;
  }

  const isOutfits = activeTab === 'outfits';

  const currentPosts = isOutfits ? posts : savedPosts;
  const availableTypes = GARMENT_TYPES.filter((type) =>
    currentPosts.some((post) => post.garmentType === type)
  );
  const activeType = garmentType && availableTypes.includes(garmentType) ? garmentType : null;
  const filterPosts = (items: Post[]) =>
    activeType ? items.filter((post) => post.garmentType === activeType) : items;

  const showTypeFilter = !error && !showSpinner && !savedLoading && !savedError && availableTypes.length > 0;

  const goToPost = (id: string) => {
    router.push({
      pathname: '/(upload)/[id]',
      params: { id },
    });
  };

  const listData = error
    ? []
    : isOutfits
      ? showSpinner
        ? []
        : filterPosts(posts)
      : savedLoading || savedError
        ? []
        : filterPosts(savedPosts);

  const listEmpty = error
    ? null
    : isOutfits
      ? showSpinner
        ? null
        : (
          <EmptyGallery
            icon="outfits"
            title="Tu historia empieza aquí"
            message="Cuando publiques tus primeros outfits, aparecerán en esta colección."
          />
        )
      : savedLoading
        ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#A81245" />
            <Text className="mt-3 text-xs text-[#A09B95]">
              Cargando tus favoritos...
            </Text>
          </View>
        )
        : savedError
          ? (
            <View className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <Text className="text-center text-sm leading-5 text-red-700">
                {savedError}
              </Text>
            </View>
          )
          : (
            <EmptyGallery
              icon="saved"
              title="Guarda lo que te inspira"
              message="Toca el marcador de tus outfits favoritos y los encontrarás aquí cuando quieras volver a ellos."
            />
          );

  return (
    <>
      <FlatList
        className="flex-1 bg-[#FCFAF8]"
        data={listData}
        numColumns={2}
        keyExtractor={(post) => post.id}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: clearance }}
        renderItem={({ item, index }) =>
          isOutfits ? (
            <View className="flex-1 pb-3">
              <FeedCard
                post={item}
                showMenu
                onEdit={() => editPost(item)}
                onDelete={() => askDelete(item)}
              />
            </View>
          ) : (
            <View className="flex-1 pb-3">
              <SavedCard
                post={item}
                index={index}
                onPress={() => goToPost(item.id)}
              />
            </View>
          )
        }
        ListHeaderComponent={
          <View>
            {/* Portada editorial */}
            <View>
              <ProfileCover
                imageUri={posts[0]?.image}
                onSettings={goToSettings}
              />

              <View
                className="absolute left-5 rounded-full border border-white/40 bg-black/20 px-3 py-1.5"
                style={{ top: insets.top + 8 }}>
                <Text className="text-[9px] font-bold uppercase tracking-[2px] text-white">
                  HIBIRIO · MI ESPACIO
                </Text>
              </View>
            </View>

            {/* Identidad */}
            <View className="items-center px-5">
              <View
                className="-mt-12 h-24 w-24 items-center justify-center rounded-full border-[4px] border-[#FCFAF8] bg-[#DCC7A8]"
                style={cardShadowLg}
              >
                <Text className="text-[26px] font-bold text-white">
                  {initialsOf(user.name)}
                </Text>
              </View>

              <View className="mt-3 w-full items-center">
                <Text className="text-center font-['Lora-Regular'] text-[27px] leading-[35px] text-[#292724]">
                  {user.name}
                </Text>

                <Text className="mt-1 text-center text-[11px] text-[#A09B95]">
                  {ROLE_LABEL[user.role]} · {user.email}
                </Text>

                {!!user.bio && (
                  <Text className="mt-3 max-w-[310px] text-center text-[13px] leading-[21px] text-[#6E6B68]">
                    {user.bio}
                  </Text>
                )}
              </View>

              {/* Estadística */}
              <View
                className="mt-5 w-full max-w-[390px] rounded-[22px] border border-[#EAE6E1] bg-white px-5 py-4"
                style={cardShadowLg}
              >
                <View className="flex-row items-center">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F4EEE7]">
                    <Shirt size={20} color={COLORS.burgundy} />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="font-['Lora-Italic'] text-base text-[#292724]">
                      Tu colección
                    </Text>
                    <Text className="mt-0.5 text-[11px] text-[#A09B95]">
                      Lo que compartes y lo que armas en tu ropero
                    </Text>
                  </View>
                </View>

                <View className="mt-4 flex-row border-t border-[#EAE6E1] pt-4">
                  <View className="flex-1">
                    <Text className="text-[23px] font-semibold text-[#A81245]">
                      {posts.length}
                    </Text>
                    <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#6E6B68]">
                      Publicaciones
                    </Text>
                  </View>

                  <View className="flex-1 border-l border-[#EAE6E1] pl-4">
                    <Text className="text-[23px] font-semibold text-[#A81245]">
                      {outfitCount}
                    </Text>
                    <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#6E6B68]">
                      Outfits
                    </Text>
                  </View>
                </View>
              </View>

              {/* Acciones principales */}
              <View className="mt-4 w-full max-w-[390px] flex-row gap-3">
                <Pressable
                  onPress={goToEditProfile}
                  accessibilityRole="button"
                  className="h-[49px] flex-1 flex-row items-center justify-center gap-2 rounded-full bg-[#A81245]"
                  style={cardShadowLg}
                >
                  <Settings2 size={16} color="#FFFFFF" />
                  <Text className="text-[13px] font-semibold text-white">
                    Editar perfil
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Separador editorial */}
            <View className="mx-5 mb-5 mt-8 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-[#EAE6E1]" />
              <Sparkles size={15} color={COLORS.champagne} />
              <View className="h-px flex-1 bg-[#EAE6E1]" />
            </View>

            {/* Selector de galerías */}
            <View className="px-5">
              <Text className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#A81245]">
                TU UNIVERSO
              </Text>

              <Text className="mb-4 mt-1 font-['Lora-Italic'] text-[25px] text-[#292724]">
                Tu colección personal
              </Text>

              <View className="flex-row rounded-full border border-[#EAE6E1] bg-white p-1.5">
                <GalleryTab
                  label="Mis publicaciones"
                  icon="outfits"
                  active={activeTab === 'outfits'}
                  onPress={() => setActiveTab('outfits')}
                />

                <GalleryTab
                  label="Guardados"
                  icon="saved"
                  active={activeTab === 'saved'}
                  onPress={() => setActiveTab('saved')}
                />
              </View>
            </View>

            {showTypeFilter && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingTop: 16 }}
                accessibilityRole="radiogroup">
                {availableTypes.map((type) => {
                  const selected = activeType === type;

                  return (
                    <Pressable
                      key={type}
                      onPress={() => setGarmentType(selected ? null : type)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      accessibilityLabel={garmentLabel(type)}
                      className={`h-10 justify-center rounded-full border px-4 ${
                        selected ? 'border-[#A81245] bg-[#A81245]/10' : 'border-[#EAE6E1] bg-white'
                      }`}>
                      <Text
                        className={`text-[12px] font-semibold ${
                          selected ? 'text-[#A81245]' : 'text-[#6E6B68]'
                        }`}>
                        {garmentLabel(type)}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* Error */}
            <View className="px-5">
              {error && (
                <View className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <Text className="text-center text-sm leading-5 text-red-700">
                    {error}
                  </Text>
                </View>
              )}

              {showSpinner && (
                <View className="items-center py-12">
                  <ActivityIndicator color="#A81245" />
                  <Text className="mt-3 text-xs text-[#A09B95]">
                    Preparando tu colección...
                  </Text>
                </View>
              )}
            </View>

            {!error && !isOutfits && savedPosts.length > 0 && !savedLoading && !savedError && (
              <View className="mt-5 px-5">
                <View className="mb-4 flex-row items-end justify-between">
                  <View>
                    <Text className="mt-1 text-[11px] text-[#6E6B68]">
                      Tus favoritos, todos en un solo lugar.
                    </Text>
                  </View>

                  <View className="rounded-full bg-[#F4EEE7] px-3 py-1.5">
                    <Text className="text-[11px] font-semibold text-[#A81245]">
                      {savedPosts.length} {savedPosts.length === 1 ? 'Atuendo' : 'Atuendos'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View className="h-5" />
          </View>
        }
        ListEmptyComponent={
          listEmpty ? <View className="px-5">{listEmpty}</View> : undefined
        }
        ListFooterComponent={
          <View className="mx-5 mt-9 border-t border-[#EAE6E1] pt-5">
            <Pressable
              onPress={signOut}
              accessibilityRole="button"
              className="h-12 flex-row items-center justify-center gap-2 rounded-full border border-[#EAE6E1] bg-white"
            >
              <LogOut size={16} color="#A81245" />
              <Text className="text-[13px] font-semibold text-[#A81245]">
                Cerrar sesión
              </Text>
            </Pressable>

            <Text className="mt-3 text-center text-[10px] tracking-[1px] text-[#A09B95]">
              HECHO CON CARIÑO · HIBIRIO
            </Text>
          </View>
        }
      />

      <ConfirmModal
        visible={deleteTarget !== null}
        title="¿Eliminar publicación?"
        message={
          deleteTarget
            ? `Se eliminará la publicación "${deleteTarget.title}".`
            : undefined
        }
        confirmLabel="Eliminar"
        danger
        loading={deleting}
        onConfirm={onDeleteConfirmed}
        onCancel={cancelDelete}
      />
    </>
  );
}

function GalleryTab({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: 'outfits' | 'saved';
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className={`min-h-[44px] flex-1 flex-row items-center justify-center gap-2 rounded-full ${
        active ? 'bg-[#A81245]' : 'bg-transparent'
      }`}
    >
      {icon === 'outfits' ? (
        <Shirt size={15} color={active ? '#FFFFFF' : '#6E6B68'} />
      ) : (
        <Bookmark
          size={15}
          color={active ? '#FFFFFF' : '#6E6B68'}
          fill={active ? '#FFFFFF' : 'none'}
        />
      )}

      <Text
        className={`text-[12px] font-semibold ${
          active ? 'text-white' : 'text-[#6E6B68]'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SavedCard({
  post,
  index,
  onPress,
}: {
  post: Post;
  index: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir outfit guardado ${index + 1}`}
      className="overflow-hidden rounded-[18px] border border-[#EAE6E1] bg-white"
      style={cardShadowLg}
    >
      <Image
        source={{ uri: post.image }}
        className="aspect-[3/4] w-full"
        resizeMode="cover"
      />

      <View className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-black/25">
        <Bookmark size={14} color="#FFFFFF" fill="#FFFFFF" />
      </View>

      <View className="flex-row items-center justify-between px-3 py-2.5">
        <Text
          numberOfLines={1}
          className="flex-1 pr-2 text-[11px] font-medium text-[#292724]"
        >
          {post.title || 'Inspiración de estilo'}
        </Text>
        <Sparkles size={13} color={COLORS.champagne} />
      </View>
    </Pressable>
  );
}

function EmptyGallery({
  icon,
  title,
  message,
}: {
  icon: 'outfits' | 'saved';
  title: string;
  message: string;
}) {
  return (
    <View className="items-center rounded-[24px] border border-[#EAE6E1] bg-white px-6 py-9">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-[#F4EEE7]">
        {icon === 'saved' ? (
          <Bookmark size={23} color="#A81245" />
        ) : (
          <Shirt size={23} color="#A81245" />
        )}
      </View>

      <Text className="text-center font-['Lora-Italic'] text-xl text-[#292724]">
        {title}
      </Text>

      <Text className="mt-2 max-w-[270px] text-center text-[12px] leading-[20px] text-[#6E6B68]">
        {message}
      </Text>
    </View>
  );
}
