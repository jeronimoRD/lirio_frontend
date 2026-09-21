import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { createReport } from '../api/reports';
import { REPORT_REASONS, REPORT_REASON_LABELS, type NewReport, type ReportReason } from '../types';
import Button from './Button';

interface Props {
  visible: boolean;
  /** Qué se reporta. Hoy la app solo expone posts; el tipo se pasa por si mañana cambia. */
  targetType: 'POST' | 'USER';
  targetId: string;
  onClose: () => void;
  /** Se llama cuando el servidor aceptó el reporte. */
  onSuccess?: () => void;
}

const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.12)',
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 20,
  shadowOpacity: 1,
  elevation: 6,
};

export default function ReportModal({ visible, targetType, targetId, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      ...(description.trim() ? { description: description.trim() } : {}),
    };

    try {
      await createReport(report);
      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el reporte');
      setSubmitting(false);
    }
  };

  const title = targetType === 'POST' ? 'Reportar publicación' : 'Reportar usuario';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(41, 39, 36, 0.45)' }}
        onPress={onClose}>
        <Pressable className="max-h-[85%] w-full rounded-t-3xl bg-white p-6" style={cardShadow}>
          <View className="mb-1 items-center">
            <View className="mb-4 h-1 w-10 rounded-full bg-[#EAE6E1]" />
            <Text className="text-center text-lg font-bold text-[#292724]">{title}</Text>
            <Text className="mt-1 text-center text-sm text-[#6E6B68]">
              Elige un motivo. Nuestro equipo lo revisará.
            </Text>
          </View>

          <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
            <View className="gap-2">
              {REPORT_REASONS.map((option) => {
                const selected = option === reason;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setReason(option);
                      setError(null);
                    }}
                    className={`flex-row items-center rounded-xl border px-4 py-3 active:opacity-80 ${
                      selected ? 'border-[#A81245] bg-[#A81245]/5' : 'border-[#EAE6E1] bg-white'
                    }`}>
                    <View
                      className={`mr-3 h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selected ? 'border-[#A81245]' : 'border-[#EAE6E1]'
                      }`}>
                      {selected && <View className="h-2.5 w-2.5 rounded-full bg-[#A81245]" />}
                    </View>
                    <Text
                      className={`text-sm font-medium ${
                        selected ? 'text-[#A81245]' : 'text-[#292724]'
                      }`}>
                      {REPORT_REASON_LABELS[option]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={
                reason === 'OTHER' ? 'Cuéntanos qué pasa (opcional)...' : 'Detalles (opcional)...'
              }
              placeholderTextColor="#A09B95"
              multiline
              numberOfLines={3}
              maxLength={500}
              className="mt-4 min-h-[96px] rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] p-4 text-sm text-[#292724]"
              textAlignVertical="top"
            />

            {error && (
              <View className="mt-3 rounded-xl bg-red-50 p-3">
                <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
              </View>
            )}
          </ScrollView>

          <View className="mt-5 flex-row gap-3">
            <View className="flex-1">
              <Button text="Cancelar" secondary onPress={onClose} disabled={submitting} />
            </View>
            <View className="flex-1">
              <Button
                text={submitting ? 'Enviando...' : 'Enviar reporte'}
                onPress={submit}
                disabled={submitting || reason === null}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
