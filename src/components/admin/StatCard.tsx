import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: ReactNode;
  badge: ReactNode;
};

export default function StatCard({ icon, title, value, badge }: StatCardProps) {
  return (
    <View className="flex-1 gap-2 rounded-xl border border-[#EDE7E1] bg-white p-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-medium uppercase text-[#7A6E65]">{title}</Text>
        <View>{icon}</View>
      </View>

      <Text className="font-['Lora-Medium'] text-2xl leading-8 text-[#241E1B]">{value}</Text>

      <View>{badge}</View>
    </View>
  );
}
