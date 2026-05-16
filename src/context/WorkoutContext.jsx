import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { workoutService } from '../utils/workoutService';

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  const { currentUser } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [activePlans, setActivePlans] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchWorkoutPlans();
    } else {
      setWorkoutPlans([]);
      setActivePlans([]);
      setCurrentSession(null);
      setProgressData({});
    }
  }, [currentUser]);

  useEffect(() => {
    const active = workoutPlans.filter(plan => plan.isActive);
    setActivePlans(active);
  }, [workoutPlans]);

  const createWorkoutPlan = async (planData) => {
    console.log('🔵 WorkoutContext.createWorkoutPlan called');
    console.log('🔵 Current user:', currentUser?.uid);
    console.log('🔵 Plan data received:', planData);

    if(!currentUser) {
      console.error('❌ No current user in WorkoutContext');
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    setError(null);
    try {
      const createdPlan = await workoutService.createWorkoutPlan(currentUser.uid, planData);
      
      setWorkoutPlans(prev => [...prev, createdPlan]);
      return createdPlan;
    } catch (err) {
      console.error('❌ Error in WorkoutContext:', err);
      console.error('❌ Error details:', err.message, err.stack);
      setError(err.message || 'Failed to create workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutPlans = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    try {
      const plans = await workoutService.getWorkoutPlans(currentUser.uid);
      setWorkoutPlans(plans);
    } catch (err) {
      setError(err.message || 'Failed to fetch workout plans');
    } finally {
      setLoading(false);
    }
  };

  const updateWorkoutPlan = async (planId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlan = await workoutService.updateWorkoutPlan(planId, updates);
      
      setWorkoutPlans(prev => 
        prev.map(plan => 
          plan.id === planId ? updatedPlan : plan
        )
      );
      
      return updatedPlan;
    } catch (err) {
      setError(err.message || 'Failed to update workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const togglePlanActive = async (planId) => {
    const plan = workoutPlans.find(p => p.id === planId);
    if (!plan) return;

    await updateWorkoutPlan(planId, {
      isActive: !plan.isActive
    });
  };

  const deleteWorkoutPlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this workout plan?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await workoutService.deleteWorkoutPlan(planId);
      
      setWorkoutPlans(prev => prev.filter(plan => plan.id !== planId));
    } catch (err) {
      setError(err.message || 'Failed to delete workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addWorkoutDay = async (planId, dayData) => {
    setLoading(true);
    setError(null);
    try {
      const newDay = await workoutService.addWorkoutDay(planId, dayData);
      
      const updatedPlans = workoutPlans.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            workoutDays: [...(plan.workoutDays || []), newDay]
          };
        }
        return plan;
      });
      
      setWorkoutPlans(updatedPlans);
      return newDay;
    } catch (err) {
      setError(err.message || 'Failed to add workout day');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkoutDay = async (planId, dayId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const plan = workoutPlans.find(p => p.id === planId);
      if (!plan) throw new Error('Workout plan not found');
      
      const updatedPlans = workoutPlans.map(plan => {
        if (plan.id === planId) {
          const updatedDays = plan.workoutDays?.map(day => {
            if (day.id === dayId) {
              return { ...day, ...updates };
            }
            return day;
          });
          return { ...plan, workoutDays: updatedDays };
        }
        return plan;
      });
      
      setWorkoutPlans(updatedPlans);
      
      return { id: dayId, ...updates };
    } catch (err) {
      setError(err.message || 'Failed to update workout day');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addExercise = async (planId, dayId, exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const newExercise = await workoutService.addExercise(planId, dayId, exerciseData);
      
      const updatedPlans = workoutPlans.map(plan => {
        if (plan.id === planId) {
          const updatedDays = plan.workoutDays?.map(day => {
            if (day.id === dayId) {
              return {
                ...day,
                exercises: [...(day.exercises || []), newExercise]
              };
            }
            return day;
          });
          return { ...plan, workoutDays: updatedDays };
        }
        return plan;
      });
      
      setWorkoutPlans(updatedPlans);
      return newExercise;
    } catch (err) {
      setError(err.message || 'Failed to add exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExercise = async (planId, dayId, exerciseId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlans = workoutPlans.map(plan => {
        if (plan.id === planId) {
          const updatedDays = plan.workoutDays?.map(day => {
            if (day.id === dayId) {
              const updatedExercises = day.exercises?.map(exercise => {
                if (exercise.id === exerciseId) {
                  return { ...exercise, ...updates };
                }
                return exercise;
              });
              return { ...day, exercises: updatedExercises };
            }
            return day;
          });
          return { ...plan, workoutDays: updatedDays };
        }
        return plan;
      });
      
      setWorkoutPlans(updatedPlans);
      
      return { id: exerciseId, ...updates };
    } catch (err) {
      setError(err.message || 'Failed to update exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExercise = async (planId, dayId, exerciseId) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlans = workoutPlans.map(plan => {
        if (plan.id === planId) {
          const updatedDays = plan.workoutDays?.map(day => {
            if (day.id === dayId) {
              const filteredExercises = day.exercises?.filter(
                exercise => exercise.id !== exerciseId
              );
              return { ...day, exercises: filteredExercises };
            }
            return day;
          });
          return { ...plan, workoutDays: updatedDays };
        }
        return plan;
      });
      
      setWorkoutPlans(updatedPlans);
      
    } catch (err) {
      setError(err.message || 'Failed to delete exercise');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startNewSession = (planId, dayId) => {
    const plan = workoutPlans.find(p => p.id === planId);
    const day = plan?.workoutDays?.find(d => d.id === dayId);
    
    if (!plan || !day) {
      throw new Error('Plan or day not found');
    }

    const newSession = {
      id: `session_${Date.now()}`,
      userId: currentUser.uid,
      planId,
      dayId,
      date: new Date().toISOString(),
      weekNumber: calculateWeekNumber(new Date()),
      exercisesCompleted: day.exercises?.map(exercise => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setsCompleted: [],
        targetSets: exercise.targetSets,
        targetReps: exercise.targetReps,
        targetWeight: exercise.targetWeight
      })) || [],
      isCompleted: false
    };

    setCurrentSession(newSession);
    return newSession;
  };

  const logSet = (exerciseId, setData) => {
    if (!currentSession) throw new Error('No active session');

    const updatedSession = { ...currentSession };
    const exerciseIndex = updatedSession.exercisesCompleted.findIndex(
      ex => ex.exerciseId === exerciseId
    );

    if (exerciseIndex === -1) {
      throw new Error('Exercise not found in session');
    }

    const setNumber = updatedSession.exercisesCompleted[exerciseIndex].setsCompleted.length + 1;
    
    updatedSession.exercisesCompleted[exerciseIndex].setsCompleted.push({
      setNumber,
      ...setData,
      isCompleted: true,
      loggedAt: new Date().toISOString()
    });

    setCurrentSession(updatedSession);
  };

  const completeSession = async (notes = '') => {
    if (!currentUser) throw new Error('User not authenticated');
    if (!currentSession) throw new Error('No active session');

    const completedSession = {
      ...currentSession,
      userId: currentUser.uid,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      notes,
      stats: calculateSessionStats(currentSession)
    };

    setLoading(true);
    setError(null);
    try {
      const savedSession = await workoutService.logSession(completedSession);
      
      setCurrentSession(null);
      
      await fetchProgressData();
      
      return savedSession;
    } catch (err) {
      setError(err.message || 'Failed to save session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSessionHistory = async (filters = {}) => {
    if (!currentUser) return [];

    setLoading(true);
    setError(null);
    try {
      const sessions = await workoutService.getSessionHistory(currentUser.uid, null, filters);
      return sessions;
    } catch (err) {
      setError(err.message || 'Failed to fetch session history');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getExerciseProgress = async (exerciseId, timeframe = 'month') => {
    if (!currentUser) return null;

    setLoading(true);
    setError(null);
    try {
      const progress = await workoutService.calculateProgress(
        currentUser.uid, 
        exerciseId, 
        timeframe
      );
      
      setProgressData(prev => ({
        ...prev,
        [exerciseId]: progress
      }));
      
      return progress;
    } catch (err) {
      setError(err.message || 'Failed to calculate progress');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const calculateProgressiveOverload = async (exerciseId) => {
    if (!currentUser) return null;

    try {
      const progress = await workoutService.calculateProgress(currentUser.uid, exerciseId);
      return progress?.progressiveOverload || 0;
    } catch (err) {
      console.error('Error calculating progressive overload:', err);
      return 0;
    }
  };

  const generateChartData = async (filters = {}) => {
    if (!currentUser) return { labels: [], datasets: [] };

    setLoading(true);
    setError(null);
    try {
      const chartData = await workoutService.generateProgressChartData(currentUser.uid, filters);
      return chartData;
    } catch (err) {
      setError(err.message || 'Failed to generate chart data');
      return { labels: [], datasets: [] };
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressData = async () => {
    if (!currentUser) return;

    try {
      await fetchWorkoutPlans();
    } catch (err) {
      console.error('Error fetching progress data:', err);
    }
  };

  const getExerciseHistory = async (exerciseId) => {
    if (!currentUser) return [];

    setLoading(true);
    setError(null);
    try {
      const history = await workoutService.getExerciseHistory(currentUser.uid, exerciseId);
      return history;
    } catch (err) {
      setError(err.message || 'Failed to fetch exercise history');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const calculateWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const calculateSessionStats = (session) => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    let maxWeight = 0;

    session.exercisesCompleted.forEach(exercise => {
      let exerciseVolume = 0;
      let exerciseMaxWeight = 0;
      
      exercise.setsCompleted.forEach(set => {
        if (set.isCompleted) {
          const setVolume = set.reps * set.weight;
          totalVolume += setVolume;
          totalSets += 1;
          totalReps += set.reps;
          
          exerciseVolume += setVolume;
          exerciseMaxWeight = Math.max(exerciseMaxWeight, set.weight);
        }
      });

      exercise.totalVolume = exerciseVolume;
      exercise.maxWeight = exerciseMaxWeight;
      
      maxWeight = Math.max(maxWeight, exerciseMaxWeight);
    });

    return {
      totalVolume,
      totalSets,
      totalReps,
      maxWeight,
      avgVolumePerSet: totalSets > 0 ? totalVolume / totalSets : 0,
      avgRepsPerSet: totalSets > 0 ? totalReps / totalSets : 0
    };
  };

  const value = {
    workoutPlans,
    activePlans,
    currentSession,
    progressData,
    loading,
    error,
    
    createWorkoutPlan,
    fetchWorkoutPlans,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    togglePlanActive,
    
    addWorkoutDay,
    updateWorkoutDay,
    addExercise,
    updateExercise,
    deleteExercise,
    
    startNewSession,
    logSet,
    completeSession,
    getSessionHistory,
    
    getExerciseProgress,
    calculateProgressiveOverload,
    generateChartData,
    getExerciseHistory,
    
    clearError: () => setError(null)
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}