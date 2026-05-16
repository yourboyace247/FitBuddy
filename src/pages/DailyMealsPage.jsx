import MainLayout from '../components/layout/MainLayout';

export default function DailyMealsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-cyan-800 mb-6">My Daily Meals</h1>
        <p className="text-gray-600">View your meal history and eating habits.</p>
      </div>
    </MainLayout>
  );
}