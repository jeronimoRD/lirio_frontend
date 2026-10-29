import type { ReactNode } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
    type ImageSourcePropType,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';

import GlassIconButton from '@/components/LiquidGlass/GlassIconButton';


// Se utiliza para crear una pantalla de héroe con un efecto de vidrio líquido en la interfaz de usuario,
//  compatible con iOS y Android. Que se ve en la parte superior de la pantalla y contiene una imagen, un título, un subtítulo y un botón de retroceso opcional.
// en las pantallas de la aplicación, como la pantalla de inicio.
interface Props {
    image: ImageSourcePropType;
    title: string;
    subtitle?: string;
    onBack?: () => void;
    heroHeight?: number;
    children: ReactNode;
}

const SHEET_OVERLAP = 36;

export default function HeroScreen({
    image,
    title,
    subtitle,
    onBack,
    heroHeight = 300,
    children,
}: Props) {
    const insets = useSafeAreaInsets();
    const scrollY = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    });

  // Parallax: la foto sube al 40% de la velocidad del scroll y se agranda al jalar.
    const imageStyle = useAnimatedStyle(() => ({
    transform: [
        {
        translateY: interpolate(
            scrollY.value,
            [-heroHeight, 0, heroHeight],
          [0, 0, -heroHeight * 0.4],
            Extrapolation.CLAMP,
        ),
        },
        {
        scale: interpolate(scrollY.value, [-heroHeight, 0], [1.7, 1], Extrapolation.CLAMP),
        },
    ],
    }));

  // El título se desvanece y sube un poco mientras la hoja lo cubre.
    const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, heroHeight * 0.5], [1, 0], Extrapolation.CLAMP),
    transform: [
        {
        translateY: interpolate(scrollY.value, [0, heroHeight], [0, -50], Extrapolation.CLAMP),
        },
    ],
    }));

    return (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FCFAF8' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Capa 1: foto + degradado + título */}
        <View
        pointerEvents="none"
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: heroHeight,
            overflow: 'hidden',
            backgroundColor: '#A81245',
        }}>
        <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
            <Image source={image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </Animated.View>

        <LinearGradient
            colors={['rgba(41,39,36,0.10)', 'rgba(41,39,36,0.60)']}
            style={StyleSheet.absoluteFill}
        />

        <Animated.View
            style={[
            { position: 'absolute', left: 24, right: 24, bottom: SHEET_OVERLAP + 22 },
            titleStyle,
            ]}>
            <View className="mb-3 flex-row items-center gap-1.5">
            <View className="h-px w-8 bg-beige" />
            <View className="h-1 w-1 rounded-full bg-white" />
            </View>
            <Text className="font-['Lora-Italic'] text-[32px] leading-10 text-white">{title}</Text>
            {!!subtitle && (
            <Text className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-beige">
                {subtitle}
            </Text>
            )}
        </Animated.View>
        </View>

      {/* Capa 2: scroll con la hoja que sube sobre la foto */}
        <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ height: heroHeight - SHEET_OVERLAP }} />

        <View
            style={{
            flexGrow: 1,
            backgroundColor: '#FCFAF8',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingTop: 12,
            paddingBottom: insets.bottom + 28,
            shadowColor: '#292724',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 10,
            }}>
            <View className="mb-5 h-1 w-10 self-center rounded-full bg-beige" />
            {children}
        </View>
        </Animated.ScrollView>

      {/* Capa 3: botón de atrás de vidrio */}
        {onBack && (
        <GlassIconButton
            onPress={onBack}
            style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 10 }}>
            <ArrowLeft size={20} color="#292724" />
        </GlassIconButton>
        )}
    </KeyboardAvoidingView>
    );
}