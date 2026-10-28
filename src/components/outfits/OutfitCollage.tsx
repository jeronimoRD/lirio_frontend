import { Image, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

import type { OutfitItem } from '../../types';

export default function OutfitCollage({ items }: { items: OutfitItem[] }) {
  if (items.length === 0) {
    return <View className="flex-1 bg-[#F4EEE7]" />;
  }

  const [first, ...rest] = items;

  return (
    <View className="flex-1 flex-row gap-[3px] bg-[#FCFAF8]">
      <CollagePiece item={first} />

      {rest.length > 0 && (
        <View className="flex-1 gap-[3px]">
          {rest.map((item) => (
            <CollagePiece key={item.postId} item={item} />
          ))}
        </View>
      )}
    </View>
  );
}

function CollagePiece({ item }: { item: OutfitItem }) {
  const uri = item.isAvailable ? item.image : null;

  return (
    <View className="flex-1 items-center justify-center overflow-hidden bg-[#F4EEE7]">
      {uri ? (
        <Image source={{ uri }} resizeMode="cover" className="h-full w-full" />
      ) : (
        <AlertTriangle size={18} color="#A09B95" />
      )}
    </View>
  );
}
