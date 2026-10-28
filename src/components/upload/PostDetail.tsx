import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, Flag, Heart } from 'lucide-react-native';

import ReportModal from '../ReportModal';
import GlassIconButton from '@/components/LiquidGlass/GlassIconButton';
import { initialsOf } from '../../utils/strings';
import { formatLikeCount } from '../../utils/format';
import { usePostDetail } from './../../hooks/upload/usePostDetail';

const SWATCH_COLORS = ['#DCC7A8', '#A81245', '#3D6B52'];

const imageShadow = {
  shadowColor: '#292724',
  shadowOffset: { width: 0, height: 12 },
  shadowRadius: 24,
  shadowOpacity: 0.18,
  elevation: 8,
};

export default function PostDetail() {
  const {
    post,
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

  const lastTapRef = useRef<number>(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!liked) {
        toggleLike();
      }
      setShowHeartAnimation(true);
      heartScale.setValue(0);
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(heartScale, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start(() => setShowHeartAnimation(false));
        }, 400);
      });
    }
    lastTapRef.current = now;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFAF8]">
        <ActivityIndicator color="#A81245" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFAF8] px-6">
        <Text className="text-center text-[#6E6B68]">No se pudo encontrar esta publicación.</Text>

        <Pressable onPress={goBack} className="mt-5 rounded-full bg-[#A81245] px-6 py-3">
          <Text className="font-semibold text-white">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10 pt-14">
        {/* Imagen como tarjeta flotante, con margen y sombra — no pegada al borde */}
        <View className="px-5">
          <View className="overflow-hidden rounded-[24px]" style={imageShadow}>
            <Pressable onPress={handleDoubleTap} activeOpacity={1}>
              <Image
                source={{ uri: post.image }}
                className="aspect-[4/5] w-full"
                resizeMode="cover"
              />

              <GlassIconButton
                onPress={goBack}
                style={{ position: 'absolute', left: 16, top: 16 }}>
                <ArrowLeft size={20} color="#292724" />
              </GlassIconButton>

              {showHeartAnimation && (
                <View className="absolute inset-0 items-center justify-center">
                  <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                    <Heart size={90} color="white" fill="white" />
                  </Animated.View>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Contenido debajo de la tarjeta */}
        <View className="gap-5 px-6 pt-6">
          <Text className="font-['Lora-Italic'] text-[26px] leading-9 text-[#292724]">
            {post.title}
          </Text>

          <View className="flex-row items-center gap-2.5">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F4EEE7]">
              <Text className="text-xs font-bold text-[#A81245]">
                {author ? initialsOf(author.name) : '??'}
              </Text>
            </View>
            <Text className="text-sm font-medium text-[#6E6B68]">
              {author ? `Publicado por ${author.name}` : 'Publicado por un usuario'}
            </Text>
          </View>

          {canReport && (
            <Pressable
              onPress={openReport}
              hitSlop={8}
              className="flex-row items-center gap-1.5 self-start">
              <Flag size={14} color="#A09B95" />
              <Text className="text-xs font-semibold text-[#A09B95]">Reportar publicación</Text>
            </Pressable>
          )}

          <Text className="text-[15px] leading-6 text-[#6E6B68]">{post.description}</Text>

          <Pressable
            onPress={toggleLike}
            hitSlop={12}
            className="flex-row items-center gap-2 self-start">
            <Heart size={22} color="#A81245" fill={liked ? '#A81245' : 'none'} />
            <Text className="text-lg font-semibold text-[#292724]">
              {formatLikeCount(likesCount)} Me gusta
            </Text>
          </Pressable>

          <View className="gap-2">
            <Text className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A09B95]">
              Colores del look
            </Text>
            <View className="flex-row gap-2">
              {SWATCH_COLORS.map((color) => (
                <View
                  key={color}
                  className="h-8 w-8 rounded-full border-2 border-white"
                  style={{
                    backgroundColor: color,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <ReportModal
        visible={reportVisible}
        targetType="POST"
        targetId={post.id}
        onClose={closeReport}
      />
    </View>
  );
}
