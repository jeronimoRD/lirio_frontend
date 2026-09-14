import { Redirect } from 'expo-router';
import { useSession } from '../src/session/context';

export default function Index() {
	const { user } = useSession();

	return <Redirect href={user ? '/(home)/home' : '/(login)/login'} />;
}