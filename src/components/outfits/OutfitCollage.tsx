import { Image, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

import type { OutfitItem } from '../../types';
import { cloudinaryImageUrl } from '../../utils/cloudinaryImage';

export default function OutfitCollage({
  items,
  imageWidth,
}: {
  items: OutfitItem[];
  imageWidth?: number;
}) {
  if (items.length === 0) {
    return <View className="flex-1 bg-icon-well" />;
  }

  const [first, ...rest] = items;

  return (
    <View className="flex-1 flex-row gap-[3px] bg-screen">
      <CollagePiece item={first} imageWidth={imageWidth} />

      {rest.length > 0 && (
        <View className="flex-1 gap-[3px]">
          {rest.map((item) => (
            <CollagePiece key={item.postId} item={item} imageWidth={imageWidth} />
          ))}
        </View>
      )}
    </View>
  );
}

function CollagePiece({ item, imageWidth }: { item: OutfitItem; imageWidth?: number }) {
  const uri = item.isAvailable ? item.image : null;
  const imageUri = uri && imageWidth ? cloudinaryImageUrl(uri, imageWidth) : uri;

  return (
    <View className="flex-1 items-center justify-center overflow-hidden bg-icon-well">
      {imageUri ? (
        <Image source={{ uri: imageUri }} resizeMode="cover" className="h-full w-full" />
      ) : (
        <AlertTriangle size={18} color="#A09B95" />
      )}
    </View>
  );
}
