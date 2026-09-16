import { Redirect } from 'expo-router';
import { useSession } from '../src/session/context';

export default function Index() {
	const { user } = useSession();

	if (!user) {
		return <Redirect href="/login" />;
	}

	return <Redirect href={user.role === 'ADMIN' ? '/(admin)' : '/home'} />;
}