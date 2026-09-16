import { Text, View } from 'react-native';

interface Props {
    title: string;
}

export default function ScreenHeader({ title }: Props) {
    return (
        <View className="items-center border-b border-[#EAE6E1] px-5 pb-3 pt-14">
        <Text className="font-['Lora-Italic'] text-xl text-[#A81245]">
            {title}
        </Text>
        </View>
    );
}