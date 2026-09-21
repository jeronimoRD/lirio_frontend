import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Flag } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { getReports, updateReport } from '../../src/api/reports';
import ConfirmModal from '../../src/components/ConfirmModal';
import Button from '../../src/components/Button';
import AdminBrandHeader from '../../src/components/admin/AdminBrandHeader';
import type { Report, ReportAction, ReportStatus } from '../../src/types';
import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from '../../src/types';
import { cardShadow } from '../../src/constants/theme';

type StatusFilter = ReportStatus | null;

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'Todas', value: null },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'Resueltas', value: 'RESOLVED' },
  { label: 'Descartadas', value: 'DISMISSED' },
];

const STATUS_BADGE: Record<ReportStatus, string> = {
  PENDING: 'bg-[#A81245]/10 text-[#A81245]',
  RESOLVED: 'bg-green-100 text-green-700',
  DISMISSED: 'bg-[#F4EEE7] text-[#6E6B68]',
};

export default function AdminReports() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Report | null>(null);

  useEffect(() => {
    getReports()
      .then((data) => {
        setReports(data);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los reportes')
      )
      .finally(() => setLoading(false));
  }, []);

  const onStatusChange = async (report: Report, status: ReportStatus) => {
    if (busyId !== null) return;

    setBusyId(report.id);
    setError(null);

    try {
      await updateReport(report.id, status);
      setReports((current) => current.map((r) => (r.id === report.id ? { ...r, status } : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el reporte');
    } finally {
      setBusyId(null);
    }
  };

  const onDeleteContent = async () => {
    const report = pendingDelete;

    if (!report || busyId !== null || report.target.deleted) return;

    const action: ReportAction = report.targetType === 'POST' ? 'DELETE_POST' : 'DELETE_USER';

    setPendingDelete(null);
    setBusyId(report.id);
    setError(null);

    try {
      await updateReport(report.id, 'RESOLVED', action);
      setReports((current) =>
        current.map((r) =>
          r.id === report.id
            ? { ...r, status: 'RESOLVED', target: { ...r.target, deleted: true } }
            : r
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el contenido');
    } finally {
      setBusyId(null);
    }
  };

  const filteredReports =
    filter === null ? reports : reports.filter((report) => report.status === filter);

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <AdminBrandHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 + insets.bottom }}>
        <View className="mx-auto w-full max-w-md">
          <View className="mb-6">
            <Pressable
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace('/(admin)');
              }}
              className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-[#F4EEE7]"
              hitSlop={8}>
              <ArrowLeft size={16} color="#4A3728" />
            </Pressable>
            <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-[#241E1B]">
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
                    active ? 'bg-[#4A3728]' : 'border border-[#EAE6E1] bg-white'
                  }`}>
                  <Text
                    className={`text-[13px] font-semibold ${
                      active ? 'text-white' : 'text-[#6E6B68]'
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

          {!loading && !error && reports.length === 0 && (
            <View className="rounded-2xl bg-white p-6" style={cardShadow}>
              <Text className="text-center text-sm text-[#6E6B68]">Aún no hay reportes.</Text>
            </View>
          )}

          {!loading && !error && reports.length > 0 && filteredReports.length === 0 && (
            <View className="rounded-2xl bg-white p-6" style={cardShadow}>
              <Text className="text-center text-sm text-[#6E6B68]">
                No hay reportes en este estado.
              </Text>
            </View>
          )}

          {!loading &&
            filteredReports.map((report) => {
              const badge = STATUS_BADGE[report.status];
              const busy = busyId === report.id;
              const pending = report.status === 'PENDING';
              const deleted = report.target.deleted;

              return (
                <View key={report.id} className="mb-4 rounded-2xl bg-white p-5" style={cardShadow}>
                  <View className="flex-row items-center justify-between gap-2">
                    <View className="flex-row items-center gap-2">
                      <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F4EEE7]">
                        <Flag size={14} color="#4A3728" />
                      </View>
                      <Text className="text-sm font-semibold text-[#292724]">
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
                    <Text className="text-base font-semibold text-[#292724]">
                      {report.targetType === 'POST'
                        ? (report.target.title ??
                          (deleted ? 'Publicación eliminada' : 'Publicación'))
                        : (report.target.userName ?? (deleted ? 'Usuario eliminado' : 'Usuario'))}
                    </Text>
                    <Text className="text-sm text-[#6E6B68]">
                      Motivo: {REPORT_REASON_LABELS[report.reason]}
                    </Text>
                    {!!report.description && (
                      <Text className="text-sm text-[#6E6B68]">{report.description}</Text>
                    )}
                    <Text className="text-xs text-[#A09B95]">
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
                            className="rounded-2xl bg-[#4A3728]"
                          />
                        </View>
                        <View className="flex-1">
                          <Button
                            text={busy ? 'Guardando...' : 'Descartar'}
                            secondary
                            textClassName="text-sm font-semibold text-[#292724]"
                            className="rounded-2xl border border-[#EAE6E1] bg-white"
                            onPress={() => onStatusChange(report, 'DISMISSED')}
                            disabled={busyId !== null}
                          />
                        </View>
                      </View>

                      {!deleted && (
                        <Pressable
                          onPress={() => setPendingDelete(report)}
                          disabled={busyId !== null}
                          className="h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-[#E9AFA6] bg-[#FBE6E1] active:opacity-80 disabled:opacity-50">
                          <Text className="text-[13px] font-semibold text-[#C2391F]">
                            {busy ? 'Eliminando...' : 'Eliminar contenido reportado'}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>

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
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}
