import { Modal, Platform, Pressable, Text, View } from 'react-native';

import Button from './Button';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.12)',
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 20,
  shadowOpacity: 1,
  elevation: 6,
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: 'rgba(41, 39, 36, 0.45)' }}
        onPress={onCancel}
      >
        <Pressable className="w-full max-w-sm rounded-2xl bg-white p-6" style={cardShadow}>
          <Text className="text-center text-lg font-bold text-[#292724]">
            {title}
          </Text>

          {!!message && (
            <Text className="mt-2 text-center text-sm leading-5 text-[#6E6B68]">
              {message}
            </Text>
          )}

          <View className="mt-6 flex-row gap-3">
            <View className="flex-1">
              <Button
                text={cancelLabel}
                secondary
                onPress={onCancel}
                disabled={loading}
                className="h-12"
              />
            </View>

            <View className="flex-1">
              <Button
                text={loading ? 'Guardando...' : confirmLabel}
                danger={danger}
                onPress={onConfirm}
                disabled={loading}
                className={
                  danger
                    ? 'bg-red-600'
                    : loading
                      ? 'bg-[#A81245]'
                      : 'bg-[#A81245]'
                }
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}