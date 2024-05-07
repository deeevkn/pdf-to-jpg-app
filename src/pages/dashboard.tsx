import { useRouter } from 'next/router';

const Dashboard = () => {
    const router = useRouter();

    const handleLogout = async () => {
        // 現実のアプリでは、トークンを無効化するAPIを呼び出すことが多い
        router.push('/');
    };

    return (
        <div>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;