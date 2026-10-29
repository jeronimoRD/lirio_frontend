# Estilos estándar · Lirio & Hibisco

Cadenas de NativeWind que ya usa la app. **Copia de aquí, no inventes una
variante nueva.** Si algo se repite tres veces, se vuelve componente en
`src/components/`.

Regla base: primero busca el componente (`Button`, `Field`, `ScreenHeader`).
Solo si no existe, usa las clases sueltas de este documento.

---

## Paleta

| Papel | Clase | Nota |
|---|---|---|
| Fondo de pantalla | `bg-screen` | Todas las pantallas |
| Superficie (tarjeta, barra) | `bg-white` | |
| Primario / marca / acción | `bg-brand`, `text-brand` | Botones principales, títulos, iconos de acento |
| Acento suave (seleccionado) | `bg-brand/10` | Chips activos, estados marcados |
| Beige decorativo | `bg-beige` | Solo detalles (avatar, swatches). **No** para botones |
| Fondo de icono circular | `bg-icon-well` | Los "wells" de Settings y admin |
| Borde | `border-line` | Campos, separadores, botones secundarios |
| Texto fuerte | `text-ink` | Títulos y contenido |
| Texto secundario | `text-ink-secondary` | Descripciones, etiquetas |
| Texto tenue / metadatos | `text-ink-muted` | Placeholders, fechas, ids |
| Error | `text-red-600`, `bg-red-50`, `border-red-200` | |
| Éxito | `text-green-700`, `bg-green-50` | |

`placeholderTextColor="#A09B95"` va como **prop**, no como clase: NativeWind
no traduce `placeholder:` en React Native.

---

## Contenedores

```tsx
// Pantalla simple
<View className="flex-1 bg-screen">

// Pantalla con scroll (formularios largos)
<ScrollView
  className="flex-1 bg-screen"
  contentContainerClassName="px-5 py-8"
  keyboardShouldPersistTaps="handled">

// Pantalla con teclado (login, register)
<KeyboardAvoidingView
  className="flex-1 bg-screen"
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

// Tarjeta
<View className="gap-4 rounded-2xl bg-white p-4" style={cardShadow}>

// Cargando
<View className="items-center py-10">
  <ActivityIndicator color="#A81245" />
</View>
```

El espaciado entre hijos es `gap-*`, nunca `mt-*` en cada hijo.
`gap-6` entre bloques grandes, `gap-4` entre campos de formulario,
`gap-2.5`/`gap-2` dentro de una tarjeta, `gap-1.5` entre etiqueta y control.

### Sombra de tarjeta

En React Native la sombra va como `style`, no como clase. Constante estándar:

```tsx
const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.10)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  shadowOpacity: 1,
  elevation: 2,
};
```

Variante más marcada (avatar de perfil, botón flotante): `height: 6`,
`shadowRadius: 16`, `elevation: 3`.

---

## Tipografía

La marca usa **Lora itálica** como fuente de titulares. Está cargada en
`app/_layout.tsx` con `expo-font` bajo el nombre `Lora-Italic`.

> No uses `font-['Lora'] italic`: esa combinación no produce una itálica real
> en React Native. La familia ya *es* la itálica.

```tsx
<Text className="font-['Lora-Italic'] text-[32px] leading-[41px] text-brand">  // Logo / marca
<Text className="font-['Lora-Italic'] text-[28px] leading-9 text-brand">      // Título de pantalla
<Text className="font-['Lora-Italic'] text-xl text-brand">                    // Título de header
<Text className="text-base font-semibold text-ink">                         // Título de elemento en lista
<Text className="text-sm text-ink-secondary">                                         // Texto secundario
<Text className="text-xs font-semibold uppercase text-ink-secondary">                 // Etiqueta de campo
<Text className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted"> // Etiqueta de sección
```

---

## Header de pantalla → usa `ScreenHeader`

`src/components/ScreenHeader.tsx` es el encabezado de las pantallas de tabs.

```tsx
import ScreenHeader from '../../src/components/ScreenHeader';

<ScreenHeader title="Guardados" />
```

No lo envuelvas en otro `View` con borde: el componente ya trae el suyo.

Header con botón de volver:

```tsx
<ScreenHeader title="Crear publicación" onBack={handleBack} />
```

La variante `onBack` rendersiza la flecha + título + spacer. Se reutiliza
en upload, settings y edit-profile.

---

## Botón → usa `Button`

`src/components/Button.tsx` es **el** botón del proyecto.

```tsx
import Button from '../src/components/Button';

// Primario (#A81245)
<Button text="Iniciar sesión" onPress={handleSubmit(onSubmit)} />

// Secundario (borde, sin relleno)
<Button text="Cancelar" onPress={() => router.back()} secondary />

// Destructivo
<Button text="Eliminar" onPress={remove} danger />

// Deshabilitado mientras se envía: el texto también cambia
<Button
  text={loading ? 'Guardando…' : 'Guardar cambios'}
  onPress={handleSubmit(submit)}
  disabled={loading}
/>
```

Props: `text`, `onPress`, `disabled?`, `secondary?`, `danger?`, `className?`,
`textClassName?`.

> Si pasas `className`, **tú** controlas el color de fondo: las clases por
> defecto se desactivan para que no choquen. Es a propósito.

| Parte | Clases |
|---|---|
| Base | `w-full h-12 flex-row items-center justify-center gap-3 rounded-full active:opacity-80 disabled:opacity-50` |
| Primario | `bg-brand` + texto `text-base font-semibold text-white` |
| Secundario | `border border-line bg-white` + texto `text-ink` |
| Destructivo | `bg-red-600` + texto blanco |

---

## Campo de texto → usa `Field`

`src/components/Field.tsx` trae etiqueta, borde rojo al fallar y mensaje de
error. Solo dentro de un formulario de react-hook-form.

```tsx
<Field
  control={control}
  name="email"
  label="Correo electrónico"
  keyboardType="email-address"
  placeholder="nombre@correo.com"
  rules={{
    required: 'El correo es obligatorio',
    maxLength: { value: 100, message: 'Máximo 100 caracteres' },
    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
  }}
/>

// Con acción a la derecha (mostrar/ocultar contraseña)
<Field
  control={control}
  name="password"
  label="Contraseña"
  secureTextEntry={!showPassword}
  rightElement={
    <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
      <Text className="text-xs font-medium text-brand">
        {showPassword ? 'Ocultar' : 'Mostrar'}
      </Text>
    </Pressable>
  }
/>
```

Clases que aplica `Field` por dentro (ya alineadas a la paleta, no hace falta
pasarlas):

| Parte | Clases |
|---|---|
| Grupo | `gap-1` |
| Etiqueta | `text-xs font-semibold uppercase text-ink-secondary` |
| Recuadro | `h-12 flex-row items-center rounded-xl border bg-white px-4` + `border-line` / `border-red-600` |
| Input | `flex-1 text-sm text-ink` |
| Error del campo | `text-xs text-red-600` |

Input suelto (fuera de un formulario, como el buscador de Explore):

```tsx
<View className="h-12 flex-row items-center gap-2 rounded-full border border-line bg-white px-4">
  <Search size={18} color="#A09B95" />
  <TextInput
    className="flex-1 text-sm text-ink"
    placeholderTextColor="#A09B95"
  />
</View>
```

Área de texto:

```tsx
<TextInput
  className="min-h-[120px] rounded-xl border border-line bg-white p-4 text-sm text-ink"
  placeholderTextColor="#A09B95"
  multiline
  textAlignVertical="top"   // sin esto el texto se centra en Android
/>
```

---

## Chip (filtro, categoría, estilo)

```tsx
<Pressable
  className={`h-9 items-center justify-center rounded-full border px-4 ${
    active ? 'border-brand bg-brand/10' : 'border-line bg-white'
  }`}>
  <Text className={`text-[13px] font-medium ${active ? 'text-brand' : 'text-ink-secondary'}`}>
```

Variante rellena (selector de rol en admin, tabs de perfil): `bg-brand`
con texto blanco.

---

## Mensajes

Error del servidor (el que devuelve la API):

```tsx
{error && (
  <View className="rounded-2xl bg-red-50 p-4">
    <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
  </View>
)}
```

Éxito:

```tsx
<View className="rounded-2xl bg-green-50 p-4">
  <Text className="text-center text-sm font-medium text-green-700">…</Text>
</View>
```

Estado vacío:

```tsx
<View className="rounded-2xl bg-white p-6" style={cardShadow}>
  <Text className="text-center text-sm text-ink-secondary">Aún no hay…</Text>
</View>
```

---

## Confirmación antes de borrar

Nunca se borra al primer toque. Patrón de dos pasos con estado
`confirmDeleteId`:

```tsx
<Button
  text={confirmDeleteId === item.id ? '¿Confirmar?' : 'Eliminar'}
  danger={confirmDeleteId === item.id}
  secondary={confirmDeleteId !== item.id}
  onPress={() => onDeletePress(item)}
  disabled={busyId !== null}
/>
```

Sobre una imagen, va como overlay:

```tsx
<View className="absolute inset-0 items-center justify-center rounded-row bg-black/50">
  <Text className="mb-2 text-center text-xs font-semibold text-white">¿Eliminar?</Text>
  …botones Sí / No
</View>
```

---

## Galería masonry (dos columnas)

```tsx
const leftColumn = posts.filter((_, i) => i % 2 === 0);
const rightColumn = posts.filter((_, i) => i % 2 === 1);

<View className="flex-row gap-3 px-4">
  {[leftColumn, rightColumn].map((column, colIndex) => (
    <View key={colIndex} className="flex-1 gap-3">
      …<Image className="w-full" style={{ height: 200, borderRadius: 14 }} resizeMode="cover" />
    </View>
  ))}
</View>
```

---

## Imagen de cabecera (hero)

En RN 0.88 `ImageBackground` está deprecado. Usa un `View` con la imagen
posicionada de forma absoluta y el contenido encima:

```tsx
<View className="h-[280px] w-full justify-end overflow-hidden">
  <Image
    source={HERO_IMAGE_URI}
    resizeMode="cover"
    className="absolute inset-0 h-full w-full"
  />
  <View className="absolute inset-0 bg-black/15" />
  <Text className="px-5 pb-5 font-['Lora-Italic'] text-xl leading-7 text-white">
    Frase de la pantalla
  </Text>
</View>
```

`objectPosition` no existe en `ImageStyle` de React Native. Para mover el
encuadre usa `imageStyle={{ transform: [{ translateY: -40 }] }}`.

---

## Tab bar

Configurada en `app/(tabs)/_layout.tsx`:

| Parte | Valor |
|---|---|
| Fondo | `#FCFAF8` |
| Borde superior | `#EAE6E1` |
| Tab activo | `#A81245` |
| Tab inactivo | `#A09B95` |
| Botón de subir (flotante) | `#A81245`, 56×56, `borderRadius: 28`, `top: -18` |