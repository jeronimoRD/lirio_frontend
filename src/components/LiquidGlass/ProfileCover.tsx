import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings } from 'lucide-react-native';

import GlassIconButton from '@/components/LiquidGlass/GlassIconButton';
import { cloudinaryImageUrl } from '../../utils/cloudinaryImage';

// Se utiliza para crear una portada de perfil con un efecto de vidrio líquido en la interfaz de usuario,
//  compatible con iOS y Android. Que se ve en la parte superior de la pantalla y contiene una imagen de fondo y un botón de configuración.
// en las pantallas de perfil de la aplicación.
interface Props {
    /** Portada elegida por el usuario. */
    bannerUri?: string;
    /** Color sólido elegido en Editar perfil. Vacío si no eligió ninguno. */
    bannerColor?: string;
    /** Respaldo mientras no haya portada: la última publicación, difuminada. */
    fallbackUri?: string;
    onSettings: () => void;
}

export default function ProfileCover({
    bannerUri,
    bannerColor,
    fallbackUri,
    onSettings,
}: Props) {
    const insets = useSafeAreaInsets();
    // Precedencia: foto > color sólido > última publicación difuminada.
    const solidColor = !bannerUri && bannerColor ? bannerColor : undefined;
    const imageUri = bannerUri || (solidColor ? undefined : fallbackUri);

    return (
    <View style={{ height: 170 + insets.top, backgroundColor: solidColor ?? '#A81245' }}>
        {!!imageUri && (
        <Image
            source={{ uri: cloudinaryImageUrl(imageUri, 1200) }}
            blurRadius={bannerUri ? 0 : 18}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
        />
        )}
        <LinearGradient
        colors={
            bannerUri || solidColor
            ? ['rgba(41,39,36,0.35)', 'rgba(41,39,36,0.05)']
            : ['rgba(168,18,69,0.55)', 'rgba(168,18,69,0.15)']
        }
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
