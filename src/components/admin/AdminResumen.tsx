import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Image as ImageIcon,
  Shirt,
  Tag,
  TriangleAlert,
  Users,
} from 'lucide-react-native';

import AdminBrandHeader from './AdminBrandHeader';
import BarsChart from './BarsChart';
import ModerationCard from './ModerationCard';
import StatCard from './StatCard';
import ConfirmModal from '../ConfirmModal';
import { REPORT_REASON_LABELS } from '../../types';
import { adminColors } from '../../constants/theme';
import { useAdminResumen } from '../../hooks/admin/useAdminResumen';

export default function AdminResumen({ showHeader = true }: { showHeader?: boolean }) {
  const insets = useSafeAreaInsets();
  const {
    users,
    posts,
    outfitCount,
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
    <View className="flex-1 bg-admin-screen">
      {showHeader && <AdminBrandHeader title="Resumen" />}

      <FlatList
        className="flex-1"
        contentContainerClassName="px-4 pb-6"
        contentContainerStyle={{
          gap: 20,
          paddingTop: 24,
          paddingBottom: 94 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        data={loading ? [] : modGroups}
        keyExtractor={(group) => group.key}
        ListHeaderComponent={
          <View className="gap-5">
            <View>
              <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-admin-ink">
                Resumen
              </Text>
              <Text className="mt-1 text-[13px] leading-4 text-admin-muted">
                Visión general del panel
              </Text>
            </View>

            {error && (
              <View className="flex-row items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <TriangleAlert size={16} color={adminColors.danger} />
                <Text className="flex-1 text-[13px] font-medium text-red-700">{error}</Text>
              </View>
            )}

            {loading ? (
              <View className="items-center py-12">
                <ActivityIndicator color={adminColors.brand} />
              </View>
            ) : (
              <>
                <View className="gap-2">
                  <View className="flex-row gap-2">
                    <StatCard
                      title="Posts"
                      icon={<ImageIcon size={14} color={adminColors.muted} />}
                      value={posts.length}
                      badge={
                        <View className="self-start rounded bg-admin-success-bg px-1.5 py-0.5">
                          <Text className="text-[10px] font-semibold leading-3 text-admin-success">
                            {postsThisWeek} esta semana
                          </Text>
                        </View>
                      }
                    />

                    <StatCard
                      title="Outfits"
                      icon={<Shirt size={14} color={adminColors.muted} />}
                      value={outfitCount}
                      badge={
                        <View className="self-start rounded bg-admin-tint px-1.5 py-0.5">
                          <Text className="text-[10px] font-semibold leading-3 text-admin-muted">
                            Públicos y privados
                          </Text>
                        </View>
                      }
                    />
                  </View>

                  <View className="flex-row gap-2">
                    <StatCard
                      title="Usuarios"
                      icon={<Users size={14} color={adminColors.muted} />}
                      value={users.length}
                      badge={
                        <View className="self-start rounded bg-admin-success-bg px-1.5 py-0.5">
                          <Text className="text-[10px] font-semibold leading-3 text-admin-success">
                            {usersThisWeek} nuevos esta semana
                          </Text>
                        </View>
                      }
                    />
                    <StatCard
                      title="Categorías"
                      icon={<Tag size={14} color={adminColors.muted} />}
                      value={categories.length}
                      badge={
                        <View className="self-start rounded bg-admin-tint px-1.5 py-0.5">
                          <Text className="text-[10px] font-semibold leading-3 text-admin-muted">
                            {categories.length} totales
                          </Text>
                        </View>
                      }
                    />
                  </View>
                </View>

                <View className="gap-4 rounded-xl border border-admin-line bg-white p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold leading-[17px] text-admin-ink">
                      Actividad
                    </Text>
                    <Text className="text-xs leading-[15px] text-admin-muted">
                      Usuarios conectados · 7 días
                    </Text>
                  </View>

                  <BarsChart counts={loginCounts} highlightIndex={todayIndex} />
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold leading-[17px] text-admin-ink">
                    Moderación
                  </Text>
                  <Pressable
                    onPress={goToReports}
                    className="flex-row items-center gap-1"
                    hitSlop={8}>
                    <Text className="text-xs font-semibold text-admin-brand">Ver todo</Text>
                    <ChevronRight size={12} color={adminColors.brand} />
                  </Pressable>
                </View>
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          loading ? undefined : (
            <View className="rounded-xl border border-admin-line bg-white p-4">
              <Text className="text-center text-[13px] text-admin-muted">
                No hay reportes pendientes.
              </Text>
            </View>
          )
        }
        renderItem={({ item: group }) => (
          <ModerationCard
            title={group.title}
            image={group.image}
            reportCount={group.count}
            reasonLabel={REPORT_REASON_LABELS[group.reason]}
            busy={busyKey === group.key}
            onApprove={() => onApprove(group)}
            onDelete={() => requestDelete(group)}
          />
        )}
      />

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
