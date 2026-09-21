import { Shirt } from 'lucide-react-native';
import { Image, Pressable, Text, View } from 'react-native';

import Button from '../Button';

type ModerationCardProps = {
  title: string;
  image?: string;
  reportCount: number;
  reasonLabel: string;
  busy: boolean;
  onApprove: () => void;
  onDelete: () => void;
};

export default function ModerationCard({
  title,
  image,
  reportCount,
  reasonLabel,
  busy,
  onApprove,
  onDelete,
}: ModerationCardProps) {
  return (
    <View className="gap-3 rounded-xl border border-[#EDE7E1] bg-white p-3.5">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-lg bg-[#F8E7ED]">
          {image ? (
            <Image
              source={{ uri: image }}
              className="h-full w-full rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <Shirt size={20} color="#A91243" />
          )}
        </View>

        <View className="flex-1 gap-1">
          <Text numberOfLines={1} className="text-sm font-semibold text-[#241E1B]">
            {title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-xs font-medium text-[#C2391F]">
              {reportCount} reporte{reportCount === 1 ? '' : 's'}
            </Text>
            <Text className="text-xs text-[#7A6E65]">·</Text>
            <Text numberOfLines={1} className="flex-1 text-xs text-[#7A6E65]">
              {reasonLabel}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button
            text={busy ? 'Enviando...' : 'Aprobar'}
            secondary
            textClassName="text-sm font-semibold text-[#292724]"
            className="rounded-2xl border border-[#EAE6E1] bg-white"
            onPress={onApprove}
            disabled={busy}
          />
        </View>
        <View className="flex-1">
          <Pressable
            onPress={onDelete}
            disabled={busy}
            className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-[#E9AFA6] bg-[#FBE6E1] active:opacity-80 disabled:opacity-50">
            <Text className="text-[13px] font-semibold text-[#C2391F]">
              {busy ? 'Enviando...' : 'Eliminar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
