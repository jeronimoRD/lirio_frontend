import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import GlassSurface from './GlassSurface';


// Propiedad del componente GlassIconButton
//  que permite personalizar su apariencia y comportamiento.
// y futuros cambios en la interfaz de usuario si se desean a futuro.
interface Props {
    onPress: () => void;
    children: ReactNode;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

export default function GlassIconButton({
    onPress,
    children,
    size = 40,
    style,
}: Props) {
    return (
    <Pressable onPress={onPress} hitSlop={8} style={style}>
        <GlassSurface
        style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
        }}
        >
        {children}
        </GlassSurface>
    </Pressable>
    );
}