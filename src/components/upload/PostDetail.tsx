import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, Flag, Heart, Sparkles } from 'lucide-react-native';

import ReportModal from '../ReportModal';
import GlassIconButton from '@/components/LiquidGlass/GlassIconButton';
import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import { glass } from '@/constants/theme';
import { initialsOf } from '../../utils/strings';
import { formatLikeCount } from '../../utils/format';
import { usePostDetail } from '../../hooks/upload/usePostDetail';
import { toggleSave as toggleSaveApi } from '../../api/posts';
import { useGarmentTypes } from '../../garment-types/context';
import { useSession } from '../../session/context';

const SWATCH_COLORS = ['#DCC7A8', '#A81245', '#3D6B52'];
const DOUBLE_TAP_MS = 300;
const DEFAULT_RATIO = 4 / 5;
const MIN_RATIO = 0.66;
const MAX_RATIO = 1.08;

const imageShadow = {
  shadowColor: '#292724',
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 22,
  shadowOpacity: 0.13,
  elevation: 6,
};

function Ornament() {
  return (
    <View
      className="flex-row items-center gap-1.5"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View className="h-px w-8 bg-beige" />
      <View className="h-1 w-1 rounded-full bg-brand" />
      <View className="h-px w-8 bg-beige" />
    </View>
  );
}

// Estado de carga inicial, mientras se obtiene la información del post. Es hermosoooo
function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center bg-screen px-8">
      <View className="mb-6 h-16 w-16 items-center justify-center rounded-full border border-line bg-white">
        <Sparkles size={23} color="#A81245" strokeWidth={1.5} />
      </View>
      <ActivityIndicator color="#A81245" size="small" />
      <Text className="mt-4 font-['Lora-Italic'] text-[19px] text-ink-secondary">
        Preparando el atuendo…
      </Text>
      <View className="mt-4 h-px w-12 bg-beige" />
    </View>
  );
}

export default function PostDetail() {
  const { labelOf } = useGarmentTypes();
  const {
    post,
    styleNames,
    author,
    loading,
    goBack,
    liked,
    likesCount,
    toggleLike,
    canReport,
    reportVisible,
    openReport,
    closeReport,
  } = usePostDetail();
  const { user: me } = useSession();
  const insets = useSafeAreaInsets();


  const serverSaved = !!(
    post?.isSavedByMe ??
    (post?.savedBy && me ? post.savedBy.includes(me.id) : false)
  );

  // Estado optimista de guardado, sincronizado con el servidor.
  const [saved, setSaved] = useState(serverSaved);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!savingRef.current) {
      setSaved(serverSaved);
    }
  }, [serverSaved, post?.id]);

  // Aviso discreto para confirmar acciones y comunicar errores.
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);

    if (noticeTimer.current) {
      clearTimeout(noticeTimer.current);
    }

    noticeTimer.current = setTimeout(() => {
      setNotice(null);
    }, 2400);
  };

  useEffect(
    () => () => {
      if (noticeTimer.current) {
        clearTimeout(noticeTimer.current);
      }
    },
    [],
  );

  const handleToggleSave = async () => {
    if (!post) return;

    if (!me) {
      showNotice('Inicia sesión para guardar publicaciones.');
      return;
    }

    if (savingRef.current) return;

    savingRef.current = true;
    const previousSaved = saved;

    setSaved(!previousSaved);

    try {
      const response = await toggleSaveApi(post.id);

      setSaved(response.saved);
      showNotice(
        response.saved
          ? 'Publicación guardada'
          : 'Quitada de guardados',
      );
    } catch {
      setSaved(previousSaved);
      showNotice('No se pudo actualizar. Inténtalo de nuevo.');
    } finally {
      savingRef.current = false;
    }
  };


  // Respeta, en lo posible, la proporción original de la fotografía.
  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const imageUri = post?.image;

  useEffect(() => {
    if (!imageUri) return;
    let active = true;

    Image.getSize(
      imageUri,
      (width, height) => {
        if (active && width > 0 && height > 0) {
          setRatio(Math.min(MAX_RATIO, Math.max(MIN_RATIO, width / height)));
        }
      },
      () => {
        // Se conserva la proporción editorial por defecto si no puede medirse.
      },
    );

    return () => {
      active = false;
    };
  }, [imageUri]);

  // Doble toque y corazón animado.
  const lastTapRef = useRef<number>(0);
  const heartScale = useSharedValue(0.55);
  const heartOpacity = useSharedValue(0);
  const likeScale = useSharedValue(1);

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }],
  }));

  const likeIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const playHeart = () => {
    heartScale.value = 0.55;
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withDelay(520, withTiming(0, { duration: 300 })),
    );
    heartScale.value = withSequence(
      withSpring(1.08, { damping: 7, stiffness: 180 }),
      withDelay(560, withSpring(0.85, { damping: 12, stiffness: 150 })),
    );
  };

  const bumpLike = () => {
    likeScale.value = withSequence(
      withTiming(1.28, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 250 }),
    );
  };

  const handleDoubleTap = () => {
    const now = Date.now();

    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      if (!liked) {
        bumpLike();
        toggleLike();
      }
      playHeart();
    }

    lastTapRef.current = now;
  };

  const handleLikePress = () => {
    if (!liked) bumpLike();
    toggleLike();
  };

  if (loading) return <LoadingState />;

  if (!post) {
    return (
      <View
        className="flex-1 items-center justify-center bg-screen px-8"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={12}
          className="absolute left-5 h-11 w-11 items-center justify-center rounded-full border border-line bg-white"
          style={{ top: insets.top + 8 }}>
          <ArrowLeft size={19} color="#292724" />
        </Pressable>

        <Ornament />
        <Text className="mt-6 text-center font-['Lora-Italic'] text-[29px] leading-[37px] text-brand">
          Este look no está disponible
        </Text>
        <Text className="mt-3 max-w-[290px] text-center text-[14px] leading-6 text-ink-secondary">
          Puede que la publicación ya no exista o que haya ocurrido un problema de conexión.
        </Text>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          className="mt-8 min-h-12 items-center justify-center rounded-full bg-brand px-9 active:opacity-80">
          <Text className="text-sm font-semibold text-white">Volver a explorar</Text>
        </Pressable>
      </View>
    );
  }

  const hasDescription = !!post.description?.trim();

  return (
    <View className="flex-1 bg-screen">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 44,
        }}>
        <View className="w-full max-w-[560px]">
          {/* Cabecera de revista */}
          <View className="mb-5 flex-row items-center justify-between px-6">
            <View className="gap-1">
              <Text className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
                HIBIRIO
              </Text>
              <Text className="font-['Lora-Italic'] text-[14px] text-ink-secondary">
                Estilo, en cada detalle
              </Text>
            </View>
            <View className="h-px w-12 bg-beige" />
          </View>

          {/* Imagen protagonista */}
          <View className="px-4">
            <View
              className="overflow-hidden rounded-hero bg-muted-surface"
              style={imageShadow}>
              <Pressable
                onPress={handleDoubleTap}
                accessibilityRole="image"
                accessibilityLabel={`Foto de ${post.title}`}
                accessibilityHint="Toca dos veces para dar me gusta">
                <Image
                  source={{ uri: post.image }}
                  style={{ width: '100%', aspectRatio: ratio }}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
                <View
                  pointerEvents="none"
                  className="absolute inset-0 items-center justify-center">
                  <Animated.View
                    style={[
                      {
                        shadowColor: '#292724',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.28,
                        shadowRadius: 15,
                        elevation: 8,
                      },
                      heartStyle,
                    ]}>
                    <Heart size={92} color="#FFFFFF" fill="#FFFFFF" strokeWidth={1.2} />
                  </Animated.View>
                </View>
              </Pressable>
            </View>

            {/* Los controles están fuera del Pressable de la imagen. */}
            <GlassIconButton
              onPress={goBack}
              style={{ position: 'absolute', left: 28, top: 14 }}>
              <ArrowLeft size={20} color="#292724" />
            </GlassIconButton>

            <GlassIconButton
              onPress={handleToggleSave}
              style={{ position: 'absolute', right: 28, top: 14 }}>
              <Bookmark
                size={18}
                color={saved ? '#A81245' : '#292724'}
                fill={saved ? '#A81245' : 'none'}
                strokeWidth={saved ? 2.5 : 1.8}
              />
            </GlassIconButton>

            <View className="absolute bottom-4 left-7 rounded-full border border-white/60 bg-screen/90 px-3 py-1.5">
              <Text className="text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-secondary">
                The look
              </Text>
            </View>
          </View>

          {/* Titular editorial */}
          <View className="gap-4 px-6 pt-8">
            <Ornament />
            <Text className="font-['Lora-Italic'] text-[31px] leading-[40px] text-ink">
              {post.title}
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-beige" />
              <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-secondary">
                Inspiración de estilo
              </Text>
            </View>
          </View>

          {/* Autor y acción para reportar */}
          <View className="mt-7 flex-row items-center gap-3 px-6">
            <View className="h-[50px] w-[50px] items-center justify-center rounded-full border border-beige bg-white p-1">
              <View className="h-full w-full items-center justify-center rounded-full bg-brand">
                <Text className="text-xs font-bold tracking-[0.08em] text-white">
                  {author ? initialsOf(author.name) : '??'}
                </Text>
              </View>
            </View>

            <View className="min-w-0 flex-1">
              <Text className="text-[9px] font-semibold uppercase tracking-[0.17em] text-ink-muted">
                Publicado por
              </Text>
              <Text numberOfLines={1} className="mt-1 text-[14px] font-semibold text-ink">
                {author ? author.name : 'Un usuario'}
              </Text>
            </View>

            {canReport && (
              <Pressable
                onPress={openReport}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Reportar publicación"
                className="min-h-10 flex-row items-center gap-1.5 rounded-full border border-line bg-white px-3 active:opacity-60">
                <Flag size={13} color="#6E6B68" strokeWidth={1.8} />
                <Text className="text-[11px] font-medium text-ink-secondary">Reportar</Text>
              </Pressable>
            )}
          </View>

          <View className="mx-6 mt-7 h-px bg-line" />

          {/* Descripción */}
          {hasDescription && (
            <View className="mx-6 mt-6 rounded-r-2xl border-l-2 border-beige bg-white/60 py-4 pl-4 pr-3">
              <Text className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand">
                Descripción de tu atuendo
              </Text>
              <Text className="text-[15px] leading-[27px] text-ink">
                {post.description}
              </Text>
            </View>
          )}

          {/* Interacción con likes */}
          <View className="mt-7 flex-row items-center justify-between px-6">
            <View className="gap-1">
              <Text className="text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                Comunidad hibirio 
              </Text>
              <Text className="font-['Lora-Italic'] text-[17px] text-ink">
                Un atuendo que inspira.
              </Text>
            </View>

            <Pressable
              onPress={handleLikePress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Me gusta, ${formatLikeCount(likesCount)}`}
              accessibilityState={{ selected: liked }}
              className={`min-h-12 flex-row items-center gap-2.5 rounded-full border px-4 active:opacity-80 ${
                liked
                  ? 'border-brand/25 bg-brand/10'
                  : 'border-line bg-white'
              }`}>
              <Animated.View style={likeIconStyle}>
                <Heart
                  size={20}
                  color="#A81245"
                  fill={liked ? '#A81245' : 'none'}
                  strokeWidth={liked ? 2.5 : 1.8}
                />
              </Animated.View>
              <Text className="text-[14px] font-semibold text-ink">
                {formatLikeCount(likesCount)}
              </Text>
            </Pressable>
          </View>

          {/* Paleta editorial */}
          <View className="mt-9 px-6">
            <View className="flex-row items-center gap-3">
              <View className="gap-1">
                <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
                  Detalles de estilo
                </Text>
                <Text className="font-['Lora-Italic'] text-[21px] text-ink">
                  Colores del look
                </Text>
              </View>
              <View className="h-px flex-1 bg-line" />
            </View>

            <View
              accessible
              accessibilityLabel="Paleta de colores del look"
              className="mt-5 flex-row items-center gap-4">
              {SWATCH_COLORS.map((color, index) => (
                <View key={color} className="items-center gap-2">
                  <View
                    className="h-[46px] w-[46px] rounded-full border-[3px] border-white"
                    style={[
                      { backgroundColor: color },
                      {
                        shadowColor: '#292724',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.12,
                        shadowRadius: 6,
                        elevation: 2,
                      },
                    ]}
                  />
                  <View
                    className={`h-1 w-1 rounded-full ${
                      index === 1 ? 'bg-brand' : 'bg-beige'
                    }`}
                  />
                </View>
              ))}
              <View className="ml-1 flex-1">
                <Text className="text-[12px] leading-5 text-ink-secondary">
                  Una paleta cálida y natural para completar la inspiración.
                </Text>
              </View>
            </View>
            {post.garmentTypeId && (
              <View className="gap-1 pt-2">
                <Text className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  Tipo de prenda
                </Text>
                <Text className="text-sm font-semibold text-ink">
                  {labelOf(post.garmentTypeId)}
                </Text>
              </View>
            )}
          </View>

          <View className="mx-6 mt-9 h-px bg-line" />
          <View className="items-center px-6 pt-6">
            <Ornament />
            <Text className="mt-3 font-['Lora-Italic'] text-[14px] text-ink-secondary">
              Encuentra tu manera de florecer como tu propia flor.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirmación breve de guardado o error */}
      {notice && (
        <Animated.View
          entering={FadeInDown.duration(220)}
          exiting={FadeOutDown.duration(200)}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: insets.bottom + 18,
            alignItems: 'center',
          }}>
          <GlassSurface
            intensity={30}
            tintColor={glass.toast}
            style={{
              borderRadius: 999,
              paddingHorizontal: 18,
              paddingVertical: 12,
              maxWidth: '100%',
            }}>
            <Text className="text-center text-[13px] font-semibold text-white">
              {notice}
            </Text>
          </GlassSurface>
        </Animated.View>
      )}

      <ReportModal
        visible={reportVisible}
        targetType="POST"
        targetId={post.id}
        onClose={closeReport}
      />
    </View>
  );
}
