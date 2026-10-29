import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { AlertTriangle, MoreVertical } from 'lucide-react-native';

import type { Outfit } from '../../types';
import { cardShadowLg } from '../../constants/theme';
import OutfitCollage from './OutfitCollage';

type OutfitCardProps = {
  outfit: Outfit;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function OutfitCard({ outfit, onEdit, onDelete }: OutfitCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openOutfit = () =>
    router.push({
      pathname: '/outfit/[id]',
      params: { id: outfit.id },
    });

  const hasMenu = !!onEdit || !!onDelete;

  return (
    <Pressable
      onPress={openOutfit}
      accessibilityRole="button"
      accessibilityLabel={`Abrir outfit ${outfit.name}`}
      className="aspect-[3/5] overflow-hidden rounded-card border border-brand/25 bg-white active:opacity-80"
      style={cardShadowLg}>
      <OutfitCollage items={outfit.items} />

      {!outfit.isAvailable && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center bg-white/75 px-4">
          <View className="flex-row items-center gap-1.5 rounded-full border border-brand-line bg-brand-tint px-3 py-1.5">
            <AlertTriangle size={12} color="#A81245" />
            <Text className="text-[10px] font-semibold text-brand">
              No disponible
            </Text>
          </View>
        </View>
      )}

      <View className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2.5 py-1">
        <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-white">
          Outfit
        </Text>
      </View>

      {hasMenu && (
        <Pressable
          onPress={() => setMenuOpen((open) => !open)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Opciones del outfit"
          className="absolute right-2.5 top-2.5 h-8 w-8 items-center justify-center rounded-full bg-black/35">
          <MoreVertical size={18} color="#FFFFFF" />
        </Pressable>
      )}

      {hasMenu && menuOpen && (
        <View className="absolute right-2.5 top-12 w-28 overflow-hidden rounded-xl border border-line bg-white">
          {onEdit && (
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="px-4 py-3">
              <Text className="text-sm text-ink">Editar</Text>
            </Pressable>
          )}

          {onDelete && (
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                onDelete();
              }}
              className="border-t border-line px-4 py-3">
              <Text className="text-sm text-red-600">Eliminar</Text>
            </Pressable>
          )}
        </View>
      )}

      <View className="bg-white px-3 py-2.5">
        <Text numberOfLines={1} className="font-['Lora-Italic'] text-[15px] text-ink">
          {outfit.name}
        </Text>

        <Text className="mt-0.5 text-[10px] text-ink-secondary">
          {outfit.items.length} prendas
          {!outfit.isPublic ? ' · Privado' : ''}
        </Text>
      </View>

    </Pressable>
  );
}
