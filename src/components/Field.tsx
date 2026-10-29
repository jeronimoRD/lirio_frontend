import { useState, type ReactNode, type Ref } from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

type Props<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  /** Elemento opcional a la derecha del input, dentro del recuadro (ej. botón mostrar/ocultar contraseña) */
  rightElement?: ReactNode;
  inputRef?: Ref<TextInputInstance>;
};

export default function Field<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  containerClassName,
  labelClassName,
  inputWrapperClassName,
  inputClassName,
  rightElement,
  inputRef,
  ...input
}: Props<T>) {
  const [focused, setFocused] = useState(false);
  const { onFocus: onFocusProp, ...inputProps } = input;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className={containerClassName ?? 'gap-1'}>
          <Text className={labelClassName ?? 'text-xs font-semibold uppercase text-ink-secondary'}>
            {label}
          </Text>

          <View
            className={
              inputWrapperClassName ??
              'h-12 flex-row items-center rounded-xl border border-line bg-white px-4'
            }
            style={
              error
                ? { borderColor: '#DC2626' }
                : focused
                  ? { borderColor: '#A81245' }
                  : undefined
            }
          >
            <TextInput
              ref={inputRef}
              className={inputClassName ?? 'flex-1 text-sm text-ink'}
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#A09B95"
              autoCapitalize="none"
              {...inputProps}
              onFocus={(event) => {
                setFocused(true);
                onFocusProp?.(event);
              }}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
            />
            {rightElement}
          </View>

          {!!error && <Text className="text-xs text-red-600">{error.message}</Text>}
        </View>
      )}
    />
  );
}