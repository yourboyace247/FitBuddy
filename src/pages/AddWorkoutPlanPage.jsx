import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import MainLayout from '../components/layout/MainLayout';
import { useWorkout } from '../context/WorkoutContext';

export default function AddWorkoutPlanPage() {
  const navigate = useNavigate();
  const { createWorkoutPlan, loading } = useWorkout();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    daysPerWeek: 4,
    targetBodyParts: [],
    workoutDays: []
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Βασικά, 2: Ημέρες, 3: Ασκήσεις

  const bodyParts = [
    'Chest', 'Back', 'Shoulders', 'Legs', 
    'Arms', 'Core', 'Full Body', 'Upper Body', 'Lower Body'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBodyPartToggle = (bodyPart) => {
    setFormData(prev => {
      const isSelected = prev.targetBodyParts.includes(bodyPart);
      return {
        ...prev,
        targetBodyParts: isSelected
          ? prev.targetBodyParts.filter(bp => bp !== bodyPart)
          : [...prev.targetBodyParts, bodyPart]
      };
    });
  };

  const handleSubmit = async () => {

    if(!currentUser) {
      alert('Please log in to create a workout plan');
      navigate('/auth');
      return;
    }
    
    if (!formData.planName.trim()) {
      alert('Please enter a plan name');
      return;
    }

    if (formData.workoutDays.length === 0) {
      alert('Please add at least one workout day');
      return;
    }

    try {
      const planData = {
        planName: formData.planName,
        description: formData.description,
        daysPerWeek: parseInt(formData.daysPerWeek),
        targetBodyParts: formData.targetBodyParts,
        workoutDays: formData.workoutDays.map(day => ({
          dayNumber: day.dayNumber,
        dayName: day.dayName,
        bodyPart: day.bodyPart,
        exercises: day.exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || 0,
          notes: exercise.notes || ''
        }))
        }))
      };

      await createWorkoutPlan(planData);
      navigate('/workout-plans'); // Redirect μετά από επιτυχία
      
    } catch (error) {
      console.error('Error creating workout plan:', error);
      alert('Failed to create workout plan. Please try again.');
    }
  };

  const addWorkoutDay = () => {
    const dayNumber = formData.workoutDays.length + 1;
    const newDay = {
      id: `day_${Date.now()}`,
      dayNumber,
      dayName: `Day ${dayNumber}`,
      bodyPart: '',
      exercises: []
    };

    setFormData(prev => ({
      ...prev,
      workoutDays: [...prev.workoutDays, newDay]
    }));
  };

  const updateWorkoutDay = (dayId, updates) => {
    setFormData(prev => ({
      ...prev,
      workoutDays: prev.workoutDays.map(day =>
        day.id === dayId ? { ...day, ...updates } : day
      )
    }));
  };

  const addExerciseToDay = (dayId, exerciseData) => {
    const newExercise = {
      id: `ex_${Date.now()}`,
      ...exerciseData
    };

    setFormData(prev => ({
      ...prev,
      workoutDays: prev.workoutDays.map(day =>
        day.id === dayId
          ? { ...day, exercises: [...day.exercises, newExercise] }
          : day
      )
    }));
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Workout Plan</h1>
          <p className="text-gray-600">Design your custom workout routine</p>
        </div>

        {/* Progress Steps */}
        <div className="flex mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : step < currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    name="planName"
                    value={formData.planName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4-Day Split, PPL Routine"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your workout plan goals..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days Per Week *
                  </label>
                  <select
                    name="daysPerWeek"
                    value={formData.daysPerWeek}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num} day{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Body Parts
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bodyParts.map(bodyPart => (
                      <button
                        key={bodyPart}
                        type="button"
                        onClick={() => handleBodyPartToggle(bodyPart)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.targetBodyParts.includes(bodyPart)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {bodyPart}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Workout Days */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Workout Days</h2>
                <button
                  type="button"
                  onClick={addWorkoutDay}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  + Add Day
                </button>
              </div>

              {formData.workoutDays.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No workout days added yet.</p>
                  <p className="text-sm mt-1">Click "Add Day" to start building your routine.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.workoutDays.map((day) => (
                    <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-lg">{day.dayName}</h3>
                        <button
                          type="button"
                          className="text-red-500 text-sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              workoutDays: prev.workoutDays.filter(d => d.id !== day.id)
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Day Name
                          </label>
                          <input
                            type="text"
                            value={day.dayName}
                            onChange={(e) => updateWorkoutDay(day.id, { dayName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Chest Day, Leg Day"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Focus Area
                          </label>
                          <select
                            value={day.bodyPart}
                            onChange={(e) => updateWorkoutDay(day.id, { bodyPart: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select body part</option>
                            {bodyParts.map(bp => (
                              <option key={bp} value={bp}>{bp}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Exercises for this day */}
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Exercises</h4>
                        {day.exercises.length === 0 ? (
                          <p className="text-sm text-gray-500">No exercises added yet.</p>
                        ) : (
                          <ul className="space-y-2">
                            {day.exercises.map(exercise => (
                              <li key={exercise.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <div>
                                  <span className="font-medium">{exercise.name}</span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    ({exercise.sets} sets × {exercise.reps} reps)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="text-red-500 text-sm"
                                  onClick={() => {
                                    updateWorkoutDay(day.id, {
                                      exercises: day.exercises.filter(ex => ex.id !== exercise.id)
                                    });
                                  }}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {/* Add Exercise Form */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <h5 className="font-medium text-gray-700 mb-2">Add Exercise</h5>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input
                              type="text"
                              placeholder="Exercise name"
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                              id={`exercise-name-${day.id}`}
                            />
                            <input
                              type="number"
                              placeholder="Sets"
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                              id={`exercise-sets-${day.id}`}
                              min="1"
                            />
                            <input
                              type="number"
                              placeholder="Reps"
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                              id={`exercise-reps-${day.id}`}
                              min="1"
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                              onClick={() => {
                                const nameInput = document.getElementById(`exercise-name-${day.id}`);
                                const setsInput = document.getElementById(`exercise-sets-${day.id}`);
                                const repsInput = document.getElementById(`exercise-reps-${day.id}`);
                                
                                if (nameInput.value && setsInput.value && repsInput.value) {
                                  addExerciseToDay(day.id, {
                                    name: nameInput.value,
                                    sets: parseInt(setsInput.value),
                                    reps: parseInt(repsInput.value),
                                    weight: 0,
                                    notes: ''
                                  });
                                  
                                  nameInput.value = '';
                                  setsInput.value = '';
                                  repsInput.value = '';
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Create */}
{currentStep === 3 && (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-6">Review Your Workout Plan</h2>
    
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="border-b pb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Plan Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Plan Name</p>
            <p className="font-medium">{formData.planName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Days Per Week</p>
            <p className="font-medium">{formData.daysPerWeek} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Target Body Parts</p>
            <p className="font-medium">
              {formData.targetBodyParts.length > 0 
                ? formData.targetBodyParts.join(', ')
                : 'None selected'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="font-medium">{formData.description || 'No description'}</p>
          </div>
        </div>
      </div>

      {/* Workout Days Details */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Workout Days ({formData.workoutDays.length})</h3>
        
        {formData.workoutDays.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No workout days added</p>
        ) : (
          <div className="space-y-4">
            {formData.workoutDays.map((day, index) => (
              <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">Day {day.dayNumber}: {day.dayName}</h4>
                    {day.bodyPart && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                        {day.bodyPart}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>

                {/* Exercises List */}
                {day.exercises.length > 0 ? (
                  <div className="mt-3">
                    <h5 className="font-medium text-gray-700 mb-2">Exercises:</h5>
                    <div className="space-y-2">
                      {day.exercises.map((exercise, exIndex) => (
                        <div key={exercise.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-medium">{exercise.name}</span>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="inline-block mr-4">
                                <span className="font-medium">Sets:</span> {exercise.sets}
                              </span>
                              <span className="inline-block mr-4">
                                <span className="font-medium">Reps:</span> {exercise.reps}
                              </span>
                              {exercise.weight > 0 && (
                                <span className="inline-block">
                                  <span className="font-medium">Weight:</span> {exercise.weight}kg
                                </span>
                              )}
                            </div>
                            {exercise.notes && (
                              <p className="text-sm text-gray-500 mt-1 italic">"{exercise.notes}"</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">#{exIndex + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No exercises added to this day</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Exercises Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-bold text-gray-700 mb-2">Plan Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="text-2xl font-bold text-blue-600">{formData.workoutDays.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Exercises</p>
            <p className="text-2xl font-bold text-green-600">
              {formData.workoutDays.reduce((total, day) => total + day.exercises.length, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Sets</p>
            <p className="text-2xl font-bold text-purple-600">
              {formData.workoutDays.reduce((total, day) => 
                total + day.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0), 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Reps</p>
            <p className="text-2xl font-bold text-orange-600">
              {formData.workoutDays.reduce((total, day) => 
                total + day.exercises.reduce((sum, ex) => sum + (ex.sets || 0) * (ex.reps || 0), 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ← Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={currentStep === 2 && formData.workoutDays.length === 0}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  alert('Create button clicked!!');
                  handleSubmit();
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Create Workout Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}