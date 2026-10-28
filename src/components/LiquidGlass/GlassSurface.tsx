/**
 * 
 * IMPORTANTE, LEER, se los pide Isa: Se utiliza un componente de vidrio líquido para crear un efecto de desenfoque
 *  y transparencia en la interfaz de usuario. E
 * ste componente es compatible con iOS y Android, utilizando `GlassView` en iOS y `BlurView` en Android. 
 * Permite personalizar la intensidad del desenfoque, el color de tinte y el objetivo del desenfoque. En 
 * Android, no se puede aplicar perfectamente el efecto de vidrio líquido,
 * pero se puede lograr un efecto similar utilizando `BlurView` con un color de fondo semitransparente.
 */

import { BlurView } from 'expo-blur'; // Android blur effect
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'; // iOS glass effect, siempre apple y sus productos :(
import type { ReactNode, RefObject } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

// Propiedad del componente GlassSurface
//  que permite personalizar su apariencia y comportamiento.
// y futuros cambios en la interfaz de usuario si se desean a futuro.
// se utiliza para crear un efecto de vidrio líquido en la interfaz de usuario, compatible con iOS y Android.
interface Props {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
    tintColor?: string;
    blurTarget?: RefObject<View | null>;
}

const DEFAULT_TINT = 'rgba(252, 250, 248, 0.55)';

export default function GlassSurface({
    children,
    style,
    intensity = 50,
    tintColor = DEFAULT_TINT,
    blurTarget,
}: Props) {
    if (Platform.OS === 'ios' && isLiquidGlassAvailable()) {
    return (
        <GlassView
        glassEffectStyle="regular"
        tintColor={tintColor}
        style={[style, styles.clip]}
        >
        {children}
        </GlassView>
    );
    }

    const canBlur = Platform.OS !== 'android' || !!blurTarget;

    return (
    <View style={[style, styles.clip, styles.edge]}>
        {canBlur && (
        <BlurView
            intensity={intensity}
            tint="light"
            blurTarget={blurTarget}
            blurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
        />
        )}
        <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }]}
        />
        {children}
    </View>
    );
}

const styles = StyleSheet.create({
    clip: { overflow: 'hidden' },
    edge: { borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' },
});