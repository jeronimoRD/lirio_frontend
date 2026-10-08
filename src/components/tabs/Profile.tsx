import { Redirect } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Settings as SettingsIcon } from 'lucide-react-native';

import ConfirmModal from '../ConfirmModal';
import FeedCard from '../FeedCard';
import type { Role } from '../../types';
import { cardShadowLg } from '../../constants/theme';
import { initialsOf } from '../../utils/strings';
import { useProfile } from './../../hooks/tabs/useProfile';

const ROLE_LABEL: Record<Role, string> = {
  USER: 'Usuario',
  ADMIN: 'Administrador',
};

export default function Profile({ active = true }: { active?: boolean }) {
  const {
    user,
    signOut,
    posts,
    leftColumn,
    rightColumn,
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

  if (!user) {
    return active ? <Redirect href="/(login)/login" /> : null;
  }

  return (
    <>
      <ScrollView className="flex-1 bg-[#FCFAF8]" contentContainerClassName="pb-10">
        {/* header-banner */}
        <View className="h-[140px] w-full bg-[#A81245]">
          <Pressable
            onPress={goToSettings}
            hitSlop={8}
            className="absolute right-5 top-6 h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <SettingsIcon size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        <View className="items-center px-5">
          {/* avatar flotando sobre el banner */}
          <View
            className="-mt-12 h-24 w-24 items-center justify-center rounded-full border-[4px] border-[#FCFAF8] bg-[#DCC7A8]"
            style={cardShadowLg}>
            <Text className="text-[26px] font-bold text-white">{initialsOf(user.name)}</Text>
          </View>

          {/* Identity */}
          <View className="mt-3 items-center gap-1">
            <Text className="font-['Lora-Regular'] text-[26px] leading-[33px] text-[#292724]">
              {user.name}
            </Text>
            <Text className="text-center text-xs leading-[145%] text-[#6E6B68]">
              {ROLE_LABEL[user.role]} · {user.email}
            </Text>
            {!!user.bio && (
              <Text className="mt-1 text-center text-[13px] leading-[18px] text-[#6E6B68]">
                {user.bio}
              </Text>
            )}
          </View>

          <View className="mt-5 w-full max-w-[390px] gap-4">
            {/* stats-card */}
            <View
              className="flex-row items-center justify-center rounded-2xl bg-white py-4"
              style={cardShadowLg}>
              <View className="items-center gap-[3px]">
                <Text className="text-lg font-bold leading-[22px] text-[#292724]">
                  {posts.length}
                </Text>
                <Text className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6E6B68]">
                  Outfits
                </Text>
              </View>
            </View>

            {/* actions-card */}
            <View className="flex-row gap-2.5">
              <Pressable
                onPress={goToEditProfile}
                className="h-12 flex-1 items-center justify-center rounded-2xl bg-[#A81245]"
                style={cardShadowLg}>
                <Text className="text-[13px] font-semibold text-white">Editar perfil</Text>
              </Pressable>

              <Pressable
                onPress={goToSettings}
                className="h-12 flex-1 items-center justify-center rounded-2xl border border-[#EAE6E1] bg-white">
                <Text className="text-[13px] font-semibold text-[#292724]">Configuración</Text>
              </Pressable>
            </View>

            {/* Outfit tabs */}
            <View className="flex-row rounded-2xl bg-white p-1.5" style={cardShadowLg}>
              <Pressable
                onPress={() => setActiveTab('outfits')}
                className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
                  activeTab === 'outfits' ? 'bg-[#A81245]' : ''
                }`}>
                <Text
                  className={`text-[13px] font-semibold ${
                    activeTab === 'outfits' ? 'text-white' : 'text-[#6E6B68]'
                  }`}>
                  Mis outfits
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('saved')}
                className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
                  activeTab === 'saved' ? 'bg-[#A81245]' : ''
                }`}>
                <Text
                  className={`text-[13px] font-semibold ${
                    activeTab === 'saved' ? 'text-white' : 'text-[#6E6B68]'
                  }`}>
                  Guardado
                </Text>
              </Pressable>
            </View>

            {/* MENSAJE DE ERROR */}
            {error && (
              <View className="rounded-2xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
              </View>
            )}

            {showSpinner && (
              <View className="items-center py-10">
                <ActivityIndicator />
              </View>
            )}

            {/* Outfit gallery */}
            {!error &&
              activeTab === 'outfits' &&
              (posts.length === 0 ? (
                <View className="rounded-2xl bg-white p-6" style={cardShadowLg}>
                  <Text className="text-center text-sm text-[#6E6B68]">
                    Aún no tienes outfits publicados.
                  </Text>
                </View>
              ) : (
                <View className="flex-row gap-2.5">
                  {[leftColumn, rightColumn].map((column, colIndex) => (
                    <View key={colIndex} className="flex-1 gap-2.5">
                      {column.map((post) => (
                        <FeedCard
                          key={post.id}
                          post={post}
                          showMenu
                          onEdit={() => editPost(post)}
                          onDelete={() => askDelete(post)}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              ))}

            {!error && activeTab === 'saved' && (
              <View className="rounded-2xl bg-white p-6" style={cardShadowLg}>
                <Text className="text-center text-sm text-[#6E6B68]">
                  Próximamente: outfits guardados.
                </Text>
              </View>
            )}

            {/* Cerrar sesión */}
            <Pressable
              onPress={signOut}
              className="mt-2 h-12 w-full items-center justify-center rounded-2xl border border-red-200 bg-white">
              <Text className="text-sm font-semibold text-red-600">Cerrar sesión</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={deleteTarget !== null}
        title="¿Eliminar publicación?"
        message={deleteTarget ? `Se eliminará la publicación "${deleteTarget.title}".` : undefined}
        confirmLabel="Eliminar"
        danger
        loading={deleting}
        onConfirm={onDeleteConfirmed}
        onCancel={cancelDelete}
      />
    </>
  );
}