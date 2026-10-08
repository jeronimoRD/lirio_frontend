import { useState } from 'react';

import { createReport } from '../../api/reports';
import {
  type NewReport,
  type ReportReason,
} from '../../types';

type UseReportModalProps = {
  targetType: 'POST' | 'USER';
  targetId: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export function useReportModal({
  targetType,
  targetId,
  onClose,
  onSuccess,
}: UseReportModalProps) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectReason = (value: ReportReason) => {
    setReason(value);
    setError(null);
  };

  const reset = () => {
    setReason(null);
    setDescription('');
    setError(null);
    setSubmitting(false);
  };

  const submit = async () => {
    if (!reason || submitting) return;

    setSubmitting(true);
    setError(null);

    const report: NewReport = {
      targetType,
      targetId,
      reason,
      ...(description.trim()
        ? { description: description.trim() }
        : {}),
    };

    try {
      await createReport(report);
      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo enviar el reporte',
      );
      setSubmitting(false);
    }
  };

  return {
    reason,
    description,
    submitting,
    error,
    setDescription,
    selectReason,
    submit,
  };
}