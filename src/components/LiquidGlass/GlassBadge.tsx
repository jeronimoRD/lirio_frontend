import { Sparkles } from 'lucide-react-native';
import type { RefObject } from 'react';
import { Text, View, type ViewInstance } from 'react-native';

import { glass } from '../../constants/theme';
import GlassSurface from './GlassSurface';

type GlassBadgeProps = {
  label: string;
  variant: 'garment' | 'outfit';
  blurTarget?: RefObject<ViewInstance | null>;
};

export default function GlassBadge({ label, variant, blurTarget }: GlassBadgeProps) {
  const isOutfit = variant === 'outfit';

  return (
    <View pointerEvents="none">
      <GlassSurface
        blurTarget={blurTarget}
        intensity={40}
        tintColor={isOutfit ? glass.outfitFill : glass.garmentFill}
        style={{
          maxWidth: 160,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}>
        {isOutfit && <Sparkles size={11} color="white" />}
        <Text
          numberOfLines={1}
          className={`text-[9px] font-bold uppercase tracking-[1.2px] ${
            isOutfit ? 'text-white' : 'text-ink'
          }`}>
          {label}
        </Text>
      </GlassSurface>
    </View>
  );
}
