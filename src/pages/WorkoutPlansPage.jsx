import MainLayout from '../components/layout/MainLayout';

export default function WorkoutPlansPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-cyan-800 mb-6">My Workout Plans</h1>
        <p className="text-gray-600">Here you will see all your workout plans and track your progress.</p>
      </div>
    </MainLayout>
  );
}