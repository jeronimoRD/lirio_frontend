import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { getReports, updateReport } from '../../api/reports';
import type { Report, ReportAction, ReportStatus } from '../../types';

export type StatusFilter = ReportStatus | null;

export function useAdminReports() {
  const router = useRouter();

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

  const requestDeleteContent = (report: Report) => setPendingDelete(report);

  const cancelDeleteContent = () => setPendingDelete(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(admin)');
  };

  return {
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
  };
}
