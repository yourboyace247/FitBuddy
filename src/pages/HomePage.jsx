import MainLayout from '../components/layout/MainLayout';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-cyan-800 mb-4">Welcome to Fit Buddy!</h1>
        <p className="text-gray-600">
          Track your workouts, monitor your progress, and achieve your fitness goals.
        </p>
        {/* Add more content soon... */}
      </div>
    </MainLayout>
  );
}