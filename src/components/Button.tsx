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
  // el botón se comporta exactamente igual que antes.
  const colorClasses = className
    ? ''
    : secondary
      ? 'border border-neutral-300 bg-white'
      : 'bg-green-500';

    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`w-full items-center justify-center rounded-xl px-4 py-4 active:opacity-80 disabled:opacity-50 ${colorClasses} ${className ?? ''}`}
      >
        <Text
          className={
            textClassName ??
            `text-base font-semibold ${secondary ? 'text-neutral-700' : 'text-white'}`
          }
        >
          {text}
        </Text>
      </Pressable>
    );
}
