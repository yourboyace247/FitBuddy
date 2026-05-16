import MainLayout from '../components/layout/MainLayout';

export default function AddDailyMealsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-cyan-800 mb-6">Add Daily Meals</h1>
        <p className="text-gray-600">Track your daily meals here.</p>
      </div>
    </MainLayout>
  );
}