import { Tabs, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, House, Plus, Search, UserRound } from 'lucide-react-native';

function UploadButton() {
    const router = useRouter();
    return (
        <Pressable
        onPress={() => router.push('/upload')}
        style={{
            top: -18,
            height: 56,
            width: 56,
            borderRadius: 28,
            backgroundColor: '#A81245',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#A81245',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        }}
        >
        <Plus size={22} color="#FFFFFF" />
        </Pressable>
    );
    }

    export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#A81245',
            tabBarInactiveTintColor: '#A09B95',
            tabBarStyle: {
            backgroundColor: '#FCFAF8',
            borderTopColor: '#EAE6E1',
            height: 64 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom,
            },
        }}
        >
        <Tabs.Screen
            name="home"
            options={{ title: 'Inicio', tabBarIcon: ({ color }) => <House size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="explore"
            options={{ title: 'Busqueda', tabBarIcon: ({ color }) => <Search size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="upload-placeholder"
            options={{
            title: '',
            tabBarButton: () => (
                <View style={{ flex: 1, alignItems: 'center' }}>
                <UploadButton />
                </View>
            ),
            }}
            listeners={{ tabPress: (e) => e.preventDefault() }}
        />
        <Tabs.Screen
            name="saved"
            options={{ title: 'Guardados', tabBarIcon: ({ color }) => <Heart size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="profile"
            options={{ title: 'Perfil', tabBarIcon: ({ color }) => <UserRound size={22} color={color} /> }}
        />
        </Tabs>
    );
}