import { Pressable, Text } from 'react-native';

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  danger?: boolean;
  className?: string;
}

export default function Button({
  text,
  onPress,
  disabled,
  secondary,
  danger,
  className,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`w-full items-center justify-center rounded-xl px-4 py-4 active:opacity-80 disabled:opacity-50 ${
        secondary
          ? 'border border-neutral-300 bg-white'
          : danger
            ? 'bg-red-600'
            : 'bg-green-500'
      } ${className ?? ''}`}
    >
      <Text
        className={`text-base font-semibold ${
          secondary ? 'text-neutral-700' : 'text-white'
        }`}
      >
        {text}
      </Text>
    </Pressable>
  );
}