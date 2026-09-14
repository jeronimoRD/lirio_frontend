import { Tabs, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
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
            backgroundColor: '#DCC7A8',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        >
        <Plus size={22} color="#FFFFFF" />
        </Pressable>
    );
    }

    export default function TabsLayout() {
    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#DCC7A8',
            tabBarInactiveTintColor: '#3D6B52',
            tabBarStyle: {
            backgroundColor: '#FCFAF8',
            borderTopColor: '#EAE6E1',
            height: 64,
            paddingTop: 8,
            },
        }}
        >
        <Tabs.Screen
            name="home"
            options={{ title: 'Home', tabBarIcon: ({ color }) => <House size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="explore"
            options={{ title: 'Explore', tabBarIcon: ({ color }) => <Search size={22} color={color} /> }}
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
            options={{ title: 'Saved', tabBarIcon: ({ color }) => <Heart size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="profile"
            options={{ title: 'Profile', tabBarIcon: ({ color }) => <UserRound size={22} color={color} /> }}
        />
        </Tabs>
    );
}