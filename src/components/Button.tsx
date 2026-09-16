import { Pressable, Text } from 'react-native';

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  danger?: boolean;
  className?: string;
  textClassName?: string;
}

export default function Button({
  text,
  onPress,
  disabled,
  secondary,
  danger,
  className,
  textClassName,
}: Props) {
  // Si se pasa un className personalizado, este toma el control total del color
  // (evita que choque con las clases de color por defecto). Si no se pasa,
  // el botón cae en la paleta de marca según su variante.
  const colorClasses = className
    ? ''
    : secondary
      ? 'border border-[#EAE6E1] bg-white'
      : danger
        ? 'bg-red-600'
        : 'bg-[#A81245]';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`w-full h-12 flex-row items-center justify-center gap-3 rounded-full active:opacity-80 disabled:opacity-50 ${colorClasses} ${className ?? ''}`}
    >
      <Text
        className={
          textClassName ??
          `text-base font-semibold ${secondary ? 'text-[#292724]' : 'text-white'}`
        }
      >
        {text}
      </Text>
    </Pressable>
  );
}