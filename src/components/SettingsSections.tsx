import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { cardShadow } from '../constants/theme';

export function IconWell({ children }: { children: ReactNode }) {
  return (
    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F4EEE7]">
      {children}
    </View>
  );
}

export function SectionLabel({ text }: { text: string }) {
  return (
    <Text className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A09B95]">
      {text}
    </Text>
  );
}

export function SectionCard({ children }: { children: ReactNode }) {
  return (
    <View className="gap-4 rounded-2xl bg-white p-4" style={cardShadow}>
      {children}
    </View>
  );
}

export function SectionHeaderRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <IconWell>{icon}</IconWell>
      <Text className="flex-1 text-sm font-semibold text-[#292724]">{label}</Text>
    </View>
  );
}