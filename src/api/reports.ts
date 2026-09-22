import type {
  NewReport,
  Report,
  ReportAction,
  ReportReason,
  ReportStatus,
  ReportTargetType,
  ReportedTarget,
} from '../types';
import { request } from './client';

/** Forma EXACTA del reporte en el servidor. No cambiar a la ligera. */
interface ReportResponse {
  _id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  target: ReportedTarget;
}

interface MessageResponse {
  message: string;
}

function toReport(data: ReportResponse): Report {
  return {
    id: data._id,
    reporterId: data.reporter_id,
    targetType: data.target_type,
    targetId: data.target_id,
    reason: data.reason,
    description: data.description ?? '',
    status: data.status,
    createdAt: data.createdAt,
    target: data.target,
  };
}

/** Envía un reporte (el reportero sale del token). */
export async function createReport(report: NewReport): Promise<void> {
  await request<MessageResponse>('/reports', {
    target_type: report.targetType,
    target_id: report.targetId,
    reason: report.reason,
    ...(report.description?.trim() ? { description: report.description.trim() } : {}),
  });
}

/** Lista de reportes (solo admin), filtrable por estado. */
export async function getReports(status?: ReportStatus): Promise<Report[]> {
  const suffix = status ? `?status=${status}` : '';
  const data = await request<ReportResponse[]>(`/reports${suffix}`);

  return data.map(toReport);
}

/**
 * Cambia el estado de un reporte (solo admin). Si viaja una acción, el
 * servidor elimina el contenido reportado y marca el reporte como resuelto.
 */
export async function updateReport(
  id: string,
  status: ReportStatus,
  action?: ReportAction
): Promise<void> {
  await request<{ report?: ReportResponse }>(
    `/reports/${id}`,
    {
      status,
      ...(action ? { action } : {}),
    },
    'PATCH'
  );
}
