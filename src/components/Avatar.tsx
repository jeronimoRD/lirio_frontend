import { Image, Text, View } from 'react-native';

import { colors } from '../constants/theme';
import { cloudinaryImageUrl } from '../utils/cloudinaryImage';
import { initialsOf } from '../utils/strings';

interface Props {
  name: string;
  /** Foto de perfil. Si falta, se muestran las iniciales. */
  uri?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

/** Círculo de identidad: foto de perfil o iniciales como respaldo. */
export default function Avatar({
  name,
  uri,
  size = 44,
  backgroundColor = colors.accent,
  textColor = '#FFFFFF',
}: Props) {
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-full"
      style={{ width: size, height: size, backgroundColor }}>
      {uri ? (
        <Image
          source={{ uri: cloudinaryImageUrl(uri, Math.round(size * 2)) }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text className="font-bold" style={{ color: textColor, fontSize: size * 0.32 }}>
          {initialsOf(name)}
        </Text>
      )}
    </View>
  );
}
