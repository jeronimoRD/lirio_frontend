import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronRight, Image as ImageIcon, Tag, TriangleAlert, Users } from 'lucide-react-native';

import AdminBrandHeader from './AdminBrandHeader';
import BarsChart from './BarsChart';
import ModerationCard from './ModerationCard';
import StatCard from './StatCard';
import ConfirmModal from '../ConfirmModal';
import { REPORT_REASON_LABELS } from '../../types';
import { useAdminResumen } from '../../hooks/admin/useAdminResumen';

export default function AdminResumen() {
  const {
    users,
    posts,
    categories,
    loading,
    error,
    busyKey,
    pendingDelete,
    deleting,
    usersThisWeek,
    postsThisWeek,
    loginCounts,
    todayIndex,
    modGroups,
    onApprove,
    onDelete,
    requestDelete,
    cancelDelete,
    goToReports,
  } = useAdminResumen();

  return (
    <View className="flex-1 bg-[#FAF8F6]">
      <AdminBrandHeader />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-6"
        contentContainerStyle={{ gap: 20, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-[#241E1B]">Resumen</Text>
          <Text className="mt-1 text-[13px] leading-4 text-[#7A6E65]">
            Visión general del panel
          </Text>
        </View>

        {error && (
          <View className="flex-row items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <TriangleAlert size={16} color="#C2391F" />
            <Text className="flex-1 text-[13px] font-medium text-red-700">{error}</Text>
          </View>
        )}

        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#A91243" />
          </View>
        ) : (
          <>
            <View className="flex-row gap-2">
              <StatCard
                title="Usuarios"
                icon={<Users size={14} color="#7A6E65" />}
                value={users.length}
                badge={
                  <View className="self-start rounded bg-[#E4F1EA] px-1.5 py-0.5">
                    <Text className="text-[10px] font-semibold leading-3 text-[#1F6B47]">
                      {usersThisWeek} nuevos esta semana
                    </Text>
                  </View>
                }
              />

              <StatCard
                title="Posts"
                icon={<ImageIcon size={14} color="#7A6E65" />}
                value={posts.length}
                badge={
                  <View className="self-start rounded bg-[#E4F1EA] px-1.5 py-0.5">
                    <Text className="text-[10px] font-semibold leading-3 text-[#1F6B47]">
                      {postsThisWeek} esta semana
                    </Text>
                  </View>
                }
              />

              <StatCard
                title="Categorías"
                icon={<Tag size={14} color="#7A6E65" />}
                value={categories.length}
                badge={
                  <View className="self-start rounded bg-[#F8E7ED] px-1.5 py-0.5">
                    <Text className="text-[10px] font-semibold leading-3 text-[#7A6E65]">
                      {categories.length} totales
                    </Text>
                  </View>
                }
              />
            </View>

            <View className="gap-4 rounded-xl border border-[#EDE7E1] bg-white p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold leading-[17px] text-[#241E1B]">
                  Actividad
                </Text>
                <Text className="text-xs leading-[15px] text-[#7A6E65]">
                  Usuarios conectados · 7 días
                </Text>
              </View>

              <BarsChart counts={loginCounts} highlightIndex={todayIndex} />
            </View>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold leading-[17px] text-[#241E1B]">
                  Moderación
                </Text>
                <Pressable
                  onPress={goToReports}
                  className="flex-row items-center gap-1"
                  hitSlop={8}>
                  <Text className="text-xs font-semibold text-[#A91243]">Ver todo</Text>
                  <ChevronRight size={12} color="#A91243" />
                </Pressable>
              </View>

              {modGroups.length === 0 ? (
                <View className="rounded-xl border border-[#EDE7E1] bg-white p-4">
                  <Text className="text-center text-[13px] text-[#7A6E65]">
                    No hay reportes pendientes.
                  </Text>
                </View>
              ) : (
                modGroups.map((group) => (
                  <ModerationCard
                    key={group.key}
                    title={group.title}
                    image={group.image}
                    reportCount={group.count}
                    reasonLabel={REPORT_REASON_LABELS[group.reason]}
                    busy={busyKey === group.key}
                    onApprove={() => onApprove(group)}
                    onDelete={() => requestDelete(group)}
                  />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={pendingDelete !== null}
        title="¿Eliminar publicación?"
        message={
          pendingDelete
            ? `Se eliminará "${pendingDelete.title}" y sus ${pendingDelete.count} reporte${
                pendingDelete.count === 1 ? '' : 's'
              } quedarán resueltos.`
            : undefined
        }
        confirmLabel="Eliminar"
        danger
        loading={deleting}
        onConfirm={onDelete}
        onCancel={cancelDelete}
      />
    </View>
  );
}
