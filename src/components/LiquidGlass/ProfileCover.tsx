import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings } from 'lucide-react-native';

import GlassIconButton from '@/components/LiquidGlass/GlassIconButton';

interface Props {
    imageUri?: string;
    onSettings: () => void;
}

export default function ProfileCover({ imageUri, onSettings }: Props) {
    const insets = useSafeAreaInsets();

    return (
    <View style={{ height: 170 + insets.top, backgroundColor: '#A81245' }}>
        {!!imageUri && (
        <Image
            source={{ uri: imageUri }}
            blurRadius={18}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
        />
        )}
        <LinearGradient
        colors={['rgba(168,18,69,0.55)', 'rgba(168,18,69,0.15)']}
        style={StyleSheet.absoluteFill}
        />
        <GlassIconButton
        onPress={onSettings}
        style={{ position: 'absolute', top: insets.top + 8, right: 16 }}>
        <Settings size={20} color="#292724" />
        </GlassIconButton>
    </View>
    );
}