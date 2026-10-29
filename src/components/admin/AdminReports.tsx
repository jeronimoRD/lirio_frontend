import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Flag } from 'lucide-react-native';

import AdminBrandHeader from './AdminBrandHeader';
import Button from '../Button';
import ConfirmModal from '../ConfirmModal';
import type { ReportStatus } from '../../types';
import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from '../../types';
import { cardShadow } from '../../constants/theme';
import { useAdminReports, type StatusFilter } from '../../hooks/admin/useAdminReports';

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'Todas', value: null },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'Resueltas', value: 'RESOLVED' },
  { label: 'Descartadas', value: 'DISMISSED' },
];

const STATUS_BADGE: Record<ReportStatus, string> = {
  PENDING: 'bg-brand/10 text-brand',
  RESOLVED: 'bg-green-100 text-green-700',
  DISMISSED: 'bg-icon-well text-ink-secondary',
};

export default function AdminReports() {
  const insets = useSafeAreaInsets();
  const {
    reports,
    filteredReports,
    loading,
    error,
    filter,
    setFilter,
    busyId,
    pendingDelete,
    onStatusChange,
    requestDeleteContent,
    cancelDeleteContent,
    onDeleteContent,
    goBack,
  } = useAdminReports();

  return (
    <View className="flex-1 bg-screen">
      <AdminBrandHeader />
      <FlatList
        className="flex-1"
        data={loading ? [] : filteredReports}
        keyExtractor={(report) => report.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 + insets.bottom }}
        ListHeaderComponent={
          <View className="mx-auto w-full max-w-md">
            <View className="mb-6">
              <Pressable
                onPress={goBack}
                className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-icon-well"
                hitSlop={8}>
                <ArrowLeft size={16} color="#4A3728" />
              </Pressable>
              <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-admin-ink">
                Reportes
              </Text>
            </View>

            {error && (
              <View className="mb-4 rounded-2xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
              </View>
            )}

            <View className="mb-4 flex-row flex-wrap gap-2">
              {FILTERS.map((option) => {
                const active = option.value === filter;
                return (
                  <Pressable
                    key={option.label}
                    onPress={() => setFilter(option.value)}
                    className={`rounded-full px-4 py-2 active:opacity-80 ${
                      active ? 'bg-admin-brown' : 'border border-line bg-white'
                    }`}>
                    <Text
                      className={`text-[13px] font-semibold ${
                        active ? 'text-white' : 'text-ink-secondary'
                      }`}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {loading && (
              <View className="items-center py-10">
                <ActivityIndicator color="#4A3728" />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="mx-auto w-full max-w-md">
            {!loading && !error && reports.length === 0 && (
              <View className="rounded-2xl bg-white p-6" style={cardShadow}>
                <Text className="text-center text-sm text-ink-secondary">Aún no hay reportes.</Text>
              </View>
            )}

            {!loading && !error && reports.length > 0 && filteredReports.length === 0 && (
              <View className="rounded-2xl bg-white p-6" style={cardShadow}>
                <Text className="text-center text-sm text-ink-secondary">
                  No hay reportes en este estado.
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item: report }) => {
          const badge = STATUS_BADGE[report.status];
          const busy = busyId === report.id;
          const pending = report.status === 'PENDING';
          const deleted = report.target.deleted;

          return (
            <View className="mx-auto mb-4 w-full max-w-md rounded-2xl bg-white p-5" style={cardShadow}>
              <View className="flex-row items-center justify-between gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-icon-well">
                    <Flag size={14} color="#4A3728" />
                  </View>
                  <Text className="text-sm font-semibold text-ink">
                    {report.targetType === 'POST' ? 'Publicación' : 'Usuario'}
                  </Text>
                </View>

                <View className={`rounded-full px-3 py-1 ${badge}`}>
                  <Text className="text-xs font-semibold">
                    {REPORT_STATUS_LABELS[report.status]}
                  </Text>
                </View>
              </View>

              <View className="mt-3 gap-1">
                <Text className="text-base font-semibold text-ink">
                  {report.targetType === 'POST'
                    ? (report.target.title ??
                      (deleted ? 'Publicación eliminada' : 'Publicación'))
                    : (report.target.userName ?? (deleted ? 'Usuario eliminado' : 'Usuario'))}
                </Text>
                <Text className="text-sm text-ink-secondary">
                  Motivo: {REPORT_REASON_LABELS[report.reason]}
                </Text>
                {!!report.description && (
                  <Text className="text-sm text-ink-secondary">{report.description}</Text>
                )}
                <Text className="text-xs text-ink-muted">
                  {new Date(report.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {pending && (
                <View className="mt-4 gap-2">
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Button
                        text={busy ? 'Guardando...' : 'Resolver'}
                        onPress={() => onStatusChange(report, 'RESOLVED')}
                        disabled={busyId !== null}
                        className="rounded-2xl bg-admin-brown"
                      />
                    </View>
                    <View className="flex-1">
                      <Button
                        text={busy ? 'Guardando...' : 'Descartar'}
                        secondary
                        textClassName="text-sm font-semibold text-ink"
                        className="rounded-2xl border border-line bg-white"
                        onPress={() => onStatusChange(report, 'DISMISSED')}
                        disabled={busyId !== null}
                      />
                    </View>
                  </View>

                  {!deleted && (
                    <Pressable
                      onPress={() => requestDeleteContent(report)}
                      disabled={busyId !== null}
                      className="h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-admin-danger-line bg-admin-danger-bg active:opacity-80 disabled:opacity-50">
                      <Text className="text-[13px] font-semibold text-admin-danger">
                        {busy ? 'Eliminando...' : 'Eliminar contenido reportado'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />

      <ConfirmModal
        visible={pendingDelete !== null}
        title="¿Eliminar contenido reportado?"
        message={
          pendingDelete
            ? pendingDelete.targetType === 'POST'
              ? `Se eliminará la publicación "${pendingDelete.target.title ?? ''}" y el reporte quedará como resuelto.`
              : `Se eliminará la cuenta "${pendingDelete.target.userName ?? ''}" con sus publicaciones y el reporte quedará como resuelto.`
            : undefined
        }
        confirmLabel="Eliminar"
        danger
        loading={busyId !== null}
        onConfirm={onDeleteContent}
        onCancel={cancelDeleteContent}
      />
    </View>
  );
}
