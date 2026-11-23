import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { UserCheck, UserPlus } from 'lucide-react-native';

import { useFollow } from '../../hooks/follow/useFollow';

interface Props {
    userId: string;
}

function FollowButton({ userId }: Props) {
    const { following, busy, ready, toggle } = useFollow(userId);

    return (
    <Pressable
        onPress={toggle}
        disabled={busy || !ready}
        accessibilityRole="button"
        accessibilityState={{ selected: following, busy }}
        accessibilityLabel={following ? 'Dejar de seguir' : 'Seguir'}
        className={`h-9 flex-row items-center justify-center gap-1.5 rounded-full border px-4 active:opacity-80 disabled:opacity-50 ${
        following ? 'border-brand bg-brand/10' : 'border-brand bg-brand'
        }`}>
        {following ? (
        <UserCheck size={14} color="#A81245" />
        ) : (
        <UserPlus size={14} color="#FFFFFF" />
        )}

        <Text
        className={`text-[12px] font-semibold ${following ? 'text-brand' : 'text-white'}`}>
        {following ? 'Siguiendo' : 'Seguir'}
        </Text>
    </Pressable>
    );
}

export default memo(FollowButton);