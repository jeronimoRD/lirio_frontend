import { useEffect, useRef, useState, type ComponentType, type Ref } from 'react';
import { Pressable, StyleSheet, View, Text, Modal, type LayoutChangeEvent } from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, House, Plus, Search, Shirt, UserRound } from 'lucide-react-native';

import GlassSurface from '@/components/LiquidGlass/GlassSurface';

const BAR_HEIGHT = 64;
const SIDE_MARGIN = 20;
const BOTTOM_GAP = 10;
const BAR_PADDING = 8;
const PILL_HEIGHT = 48;
const SLOTS = 5; // 4 tabs + el hueco del botón +
const ADD_SIZE = 66;

const INACTIVE = '#6E6B68';
const ACTIVE = '#A81245';

// `slot` es la posición real en la barra (el slot 2 lo ocupa el botón +).
const TABS = [
    { label: 'Inicio', icon: House, slot: 0 },
    { label: 'Explorar', icon: Search, slot: 1 },
    { label: 'Vestidor', icon: Shirt, slot: 3 },
    { label: 'Perfil', icon: UserRound, slot: 4 },
] as const;

const SPRING = { damping: 18, stiffness: 220, mass: 0.7 };
const BOUNCE = { damping: 11, stiffness: 240, mass: 0.6 };

const barShadow = {
    borderRadius: BAR_HEIGHT / 2,
    shadowColor: '#5C4B36',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    shadowOpacity: 0.18,
    elevation: 8,
};

interface Props {
    index: number;
    onChange: (index: number) => void;
    blurTarget?: Ref<View> | any;
}

export default function FloatingTabBar({ index, onChange, blurTarget }: Props) {
    const insets = useSafeAreaInsets();
    const [barWidth, setBarWidth] = useState(0);
    const pillX = useSharedValue(0);
    const initialized = useRef(false);

    const slotWidth = barWidth > 0 ? (barWidth - BAR_PADDING * 2) / SLOTS : 0;
    const pillWidth = Math.max(slotWidth - 6, 0);
    const slot = TABS[index]?.slot ?? 0;

    useEffect(() => {
    if (!slotWidth) return;
    const target = BAR_PADDING + slot * slotWidth + (slotWidth - pillWidth) / 2;

    if (!initialized.current) {
      pillX.value = target; // primera vez: sin animar
        initialized.current = true;
    } else {
        pillX.value = withSpring(target, SPRING);
    }
    }, [slot, slotWidth, pillWidth, pillX]);

    const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    }));

    const onLayout = (event: LayoutChangeEvent) => setBarWidth(event.nativeEvent.layout.width);

    return (
    <View
        pointerEvents="box-none"
        style={{
        position: 'absolute',
        left: SIDE_MARGIN,
        right: SIDE_MARGIN,
        bottom: insets.bottom + BOTTOM_GAP,
        }}>
        <View style={barShadow}>
        <GlassSurface
            blurTarget={blurTarget}
            intensity={60}
            style={{ height: BAR_HEIGHT, borderRadius: BAR_HEIGHT / 2 }}>
            <View
            onLayout={onLayout}
            style={{
                height: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: BAR_PADDING,
            }}>
            {slotWidth > 0 && (
                <Animated.View
                pointerEvents="none"
                style={[
                    {
                    position: 'absolute',
                    left: 0,
                    top: (BAR_HEIGHT - PILL_HEIGHT) / 2,
                    width: pillWidth,
                    height: PILL_HEIGHT,
                    borderRadius: PILL_HEIGHT / 2,
                    backgroundColor: 'rgba(168, 18, 69, 0.10)',
                    borderWidth: 1,
                    borderColor: 'rgba(168, 18, 69, 0.12)',
                    },
                    pillStyle,
                ]}
                />
            )}

            {TABS.map((tab, i) => (
                <View key={tab.label} style={{ flex: 1, flexDirection: 'row' }}>
                <TabItem
                    label={tab.label}
                    icon={tab.icon}
                    active={index === i}
                    onPress={() => onChange(i)}
                />
                </View>
            )).reduce<React.ReactNode[]>((acc, node, i) => {
                acc.push(node);
                if (i === 1) acc.push(<View key="gap" style={{ flex: 1 }} />);
                return acc;
            }, [])}
            </View>
        </GlassSurface>
        </View>

      {/* El + vive fuera del vidrio para poder sobresalir */}
        <View
        pointerEvents="box-none"
        style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: -26,
            alignItems: 'center',
        }}>
        <AddButton />
        </View>
    </View>
    );
}

function TabItem({
    label,
    icon: Icon,
    active,
    onPress,
}: {
    label: string;
    icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    active: boolean;
    onPress: () => void;
}) {
    const progress = useSharedValue(active ? 1 : 0);

useEffect(() => {
    // Al activarse usa un resorte con rebote; al desactivarse, uno más calmado
    // Esto hace que la animación de activación sea más llamativa y divertida, 
    // mientras que la desactivación es más sutil y elegante.
    progress.value = withSpring(active ? 1 : 0, active ? BOUNCE : SPRING);
    }, [active, progress]);

    const iconWrap = useAnimatedStyle(() => ({
    transform: [
        { translateY: interpolate(progress.value, [0, 1], [0, -2]) },
        { scale: interpolate(progress.value, [0, 1], [1, 1.14]) },
    ],
    }));
    const inactiveIcon = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
    const activeIcon = useAnimatedStyle(() => ({ opacity: progress.value }));
    const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [INACTIVE, ACTIVE]),
    }));

    return (
    <Pressable
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityLabel={label}
        accessibilityState={{ selected: active }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', gap: 2 }}>
        <Animated.View style={[{ width: 22, height: 22 }, iconWrap]}>
            <Animated.View style={[StyleSheet.absoluteFill, inactiveIcon]}>
            <Icon size={21} color={INACTIVE} />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, activeIcon]}>
            <Icon size={21} color={ACTIVE} strokeWidth={2.4} />
            </Animated.View>
        </Animated.View>
        <Animated.Text style={[{ fontSize: 10, fontWeight: '600' }, labelStyle]}>
            {label}
        </Animated.Text>
        </View>
    </Pressable>
    );
}


function AddButton() {
    const router = useRouter();
    const press = useSharedValue(0);
    const [modalVisible, setModalVisible] = useState(false);

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(press.value, [0, 1], [1, 0.9]) }],
    }));

    const plusStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${press.value * 90}deg` }],
    }));

    const navigateTo = (route: '/upload' | '/outfit/new') => {
        setModalVisible(false);
        router.push(route);
    };

    return (
        <>
            <Pressable
                onPressIn={() => {
                    press.value = withSpring(1, SPRING);
                }}
                onPressOut={() => {
                    press.value = withSpring(0, BOUNCE);
                }}
                onPress={() => setModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Elegir qué crear"
            >
                <Animated.View
                    style={[
                        {
                            width: ADD_SIZE,
                            height: ADD_SIZE,
                            borderRadius: ADD_SIZE / 2,
                            backgroundColor: ACTIVE,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 4,
                            borderColor: 'rgba(255, 255, 255, 0.75)',
                            shadowColor: ACTIVE,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 12,
                            elevation: 8,
                        },
                        buttonStyle,
                    ]}
                >
                    <Animated.View style={plusStyle}>
                        <Plus size={28} color="#FFFFFF" strokeWidth={2.4} />
                    </Animated.View>
                </Animated.View>
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
                statusBarTranslucent
            >
                <Pressable
                    className="flex-1 items-center justify-center bg-black/40 px-6"
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable
                        onPress={(event) => event.stopPropagation()}
                        className="w-full max-w-[340px] rounded-[28px] border border-[#EAE6E1] bg-[#FCFAF8] p-6"
                    >
                        <Text className="font-['Lora-Italic'] text-[25px] text-[#292724]">
                            ¿Qué quieres crear?
                        </Text>

                        <Text className="mb-6 mt-2 text-[13px] leading-5 text-[#6E6B68]">
                            Elige qué quieres agregar a LirioHibisco.
                        </Text>

                        <Pressable
                            onPress={() => navigateTo('/upload')}
                            className="mb-3 items-center rounded-full bg-[#A81245] px-5 py-4 active:opacity-80"
                        >
                            <Text className="text-[14px] font-semibold text-white">
                                Crear publicación
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => navigateTo('/outfit/new')}
                            className="items-center rounded-full border border-[#EAE6E1] bg-white px-5 py-4 active:opacity-80"
                        >
                            <Text className="text-[14px] font-semibold text-[#292724]">
                                Crear outfit
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setModalVisible(false)}
                            className="mt-4 items-center py-2"
                        >
                            <Text className="text-[13px] font-medium text-[#6E6B68]">
                                Cancelar
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
