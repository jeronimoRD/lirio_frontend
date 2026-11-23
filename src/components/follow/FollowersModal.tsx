import { memo } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    Text,
    View,
} from 'react-native';

import type { Follower } from '../../api/follows';
import { useFollowers } from '../../hooks/follow/useFollowers';
import { cloudinaryImageUrl } from '../../utils/cloudinaryImage';
import { initialsOf } from '../../utils/strings';

interface Props {
    visible: boolean;
    userId: string | undefined;
    total: number;
    onClose: () => void;
}

const sheetShadow = {
    shadowColor: 'rgba(92, 75, 54, 0.12)',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 6,
};

const FollowerRow = memo(function FollowerRow({ follower }: { follower: Follower }) {
    return (
        <View className="flex-row items-center gap-3 py-2.5">
        <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-beige">
            {follower.avatarUrl ? (
            <Image
                source={{ uri: cloudinaryImageUrl(follower.avatarUrl, 120) }}
                className="h-full w-full"
                resizeMode="cover"
            />
            ) : (
            <Text className="text-sm font-bold text-white">{initialsOf(follower.userName)}</Text>
            )}
        </View>

        <Text numberOfLines={1} className="flex-1 text-base font-semibold text-ink">
            {follower.userName}
        </Text>
        </View>
    );
});

export default function FollowersModal({ visible, userId, total, onClose }: Props) {
    const { items, showSpinner, loadingMore, error, loadMore } = useFollowers(userId, visible);

    return (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent={Platform.OS === 'android'}
        onRequestClose={onClose}>
        <Pressable className="flex-1 justify-end bg-ink/45" onPress={onClose}>
        <Pressable className="h-[70%] w-full rounded-t-3xl bg-white p-6" style={sheetShadow}>
            <View className="mb-4 items-center">
            <View className="mb-4 h-1 w-10 rounded-full bg-line" />

            <Text className="font-['Lora-Italic'] text-xl text-brand">Seguidores</Text>

            <Text className="mt-1 text-center text-sm text-ink-secondary">
                {total} {total === 1 ? 'persona te sigue' : 'personas te siguen'}
                </Text>
            </View>

            {error && items.length === 0 ? (
                <View className="rounded-2xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
                </View>
            ) : showSpinner ? (
                <View className="items-center py-10">
                <ActivityIndicator color="#A81245" />
                </View>
            ) : (
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <FollowerRow follower={item} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={7}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="h-px bg-line" />}
                ListEmptyComponent={
                <View className="rounded-2xl bg-screen p-6">
                    <Text className="text-center text-sm text-ink-secondary">
                        Aún nadie te sigue. Comparte tus outfits para llegar a más personas.
                    </Text>
                </View>
                }
            />
            )}
            </Pressable>
        </Pressable>
    </Modal>
    );
}