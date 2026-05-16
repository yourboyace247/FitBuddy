import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const generateId = (prefix = '') => { 
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const workoutService = {
  
  createWorkoutPlan: async (userId, planData) => {
    try {
      const planId = generateId('plan_');
      
      const planWithMetadata = {
        id: planId,
        userId,
        ...planData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        workoutDays: [] 
      };

      const docRef = await addDoc(collection(db, 'workoutPlans'), planWithMetadata);
      
      // Mock data version (για testing χωρίς Firebase)
      // return Promise.resolve({ id: planId, ...planWithMetadata });
      
      return { id: docRef.id, ...planWithMetadata };
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }
  },

  getWorkoutPlans: async (userId) => {
    try {
      if (!userId) return [];

      const q = query(
        collection(db, 'workoutPlans'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const plans = [];
      
      querySnapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() });
      });

      // data for testing
      // const mockPlans = [
      //   {
      //     id: 'plan_1',
      //     userId,
      //     planName: '4-Day Split',
      //     description: 'My weekly workout routine',
      //     daysPerWeek: 4,
      //     isActive: true,
      //     createdAt: new Date().toISOString(),
      //     workoutDays: []
      //   }
      // ];
      // return Promise.resolve(mockPlans);

      return plans;
    } catch (error) {
      console.error('Error getting workout plans:', error);
      throw error;
    }
  },

  updateWorkoutPlan: async (planId, updates) => {
    try {
      const planRef = doc(db, 'workoutPlans', planId);
      
      await updateDoc(planRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Mock version
      // return Promise.resolve({ id: planId, ...updates });
      
      return { id: planId, ...updates };
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error;
    }
  },

  deleteWorkoutPlan: async (planId) => {
    try {
      await deleteDoc(doc(db, 'workoutPlans', planId));
      
      // Mock version
      // return Promise.resolve({ success: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      throw error;
    }
  },

  addWorkoutDay: async (planId, dayData) => {
    try {
      const dayId = generateId('day_');
      const newDay = {
        id: dayId,
        ...dayData,
        exercises: []
      };

      const planRef = doc(db, 'workoutPlans', planId);
      const planSnapshot = await getDoc(planRef);
      const plan = planSnapshot.data();
      
      const updatedDays = [...(plan.workoutDays || []), newDay];
      
      await updateDoc(planRef, {
        workoutDays: updatedDays,
        updatedAt: serverTimestamp()
      });

      // Mock version
      // return Promise.resolve(newDay);
      
      return newDay;
    } catch (error) {
      console.error('Error adding workout day:', error);
      throw error;
    }
  },

  addExercise: async (planId, dayId, exerciseData) => {
    try {
      const exerciseId = generateId('ex_');
      const newExercise = {
        id: exerciseId,
        ...exerciseData,
        previousSessions: []
      };

      const planRef = doc(db, 'workoutPlans', planId);
      const planSnapshot = await getDoc(planRef);
      const plan = planSnapshot.data();
      
      const updatedDays = plan.workoutDays.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: [...(day.exercises || []), newExercise]
          };
        }
        return day;
      });
      
      await updateDoc(planRef, {
        workoutDays: updatedDays,
        updatedAt: serverTimestamp()
      });

      // Mock version
      // return Promise.resolve(newExercise);
      
      return newExercise;
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }
  },

  logSession: async (sessionData) => {
    try {
      const sessionId = generateId('session_');
      
      const sessionWithMetadata = {
        id: sessionId,
        ...sessionData,
        loggedAt: serverTimestamp(),
        stats: calculateSessionStats(sessionData)
      };

      const docRef = await addDoc(collection(db, 'workoutSessions'), sessionWithMetadata);
      
      await updateProgressStats(sessionData.userId, sessionWithMetadata);

      // Mock version
      // return Promise.resolve(sessionWithMetadata);
      
      return { id: docRef.id, ...sessionWithMetadata };
    } catch (error) {
      console.error('Error logging session:', error);
      throw error;
    }
  },

  getSessionHistory: async (userId, exerciseId = null, filters = {}) => {
    try {
      let q = query(
        collection(db, 'workoutSessions'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      if (exerciseId) {
        q = query(q, where('exercisesCompleted', 'array-contains', { exerciseId }));
      }

      if (filters.weekNumber) {
        q = query(q, where('weekNumber', '==', filters.weekNumber));
      }

      if (filters.planId) {
        q = query(q, where('planId', '==', filters.planId));
      }

      const querySnapshot = await getDocs(q);
      const sessions = [];
      
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });

      // data for testing
      // const mockSessions = [
      //   {
      //     id: 'session_1',
      //     userId,
      //     planId: 'plan_1',
      //     dayId: 'day_1',
      //     date: new Date().toISOString(),
      //     weekNumber: 1,
      //     exercisesCompleted: [
      //       {
      //         exerciseId: 'ex_1',
      //         exerciseName: 'Squats',
      //         setsCompleted: [
      //           { setNumber: 1, reps: 8, weight: 100, isCompleted: true },
      //           { setNumber: 2, reps: 8, weight: 100, isCompleted: true }
      //         ]
      //       }
      //     ]
      //   }
      // ];
      // return Promise.resolve(mockSessions);

      return sessions;
    } catch (error) {
      console.error('Error getting session history:', error);
      throw error;
    }
  },

  calculateProgress: async (userId, exerciseId, timeframe = 'month') => {
    try {
      const sessions = await workoutService.getSessionHistory(userId, exerciseId);
      
      if (sessions.length === 0) {
        return {
          exerciseId,
          progress: [],
          currentStats: null,
          previousStats: null,
          progressiveOverload: 0
        };
      }

      const weeklyProgress = organizeByWeek(sessions, exerciseId);
      
      const currentWeek = weeklyProgress[weeklyProgress.length - 1];
      const previousWeek = weeklyProgress.length > 1 ? weeklyProgress[weeklyProgress.length - 2] : null;
      
      const progressData = {
        exerciseId,
        progress: weeklyProgress,
        currentStats: currentWeek,
        previousStats: previousWeek,
        progressiveOverload: calculateProgressiveOverload(currentWeek, previousWeek)
      };

      return progressData;
    } catch (error) {
      console.error('Error calculating progress:', error);
      throw error;
    }
  },

  generateProgressChartData: async (userId, filters = {}) => {
    try {
      const { exerciseId, planId, startDate, endDate, metric = 'volume' } = filters;
      
      const sessions = await workoutService.getSessionHistory(userId, exerciseId, filters);
      
      if (sessions.length === 0) {
        return {
          labels: [],
          datasets: []
        };
      }

      const chartData = prepareChartData(sessions, metric, exerciseId);
      
      return chartData;
    } catch (error) {
      console.error('Error generating chart data:', error);
      throw error;
    }
  },

  getExerciseHistory: async (userId, exerciseId) => {
    try {
      const sessions = await workoutService.getSessionHistory(userId, exerciseId);
      
      const exerciseHistory = sessions.map(session => {
        const exerciseData = session.exercisesCompleted.find(
          ex => ex.exerciseId === exerciseId
        );
        
        if (!exerciseData) return null;
        
        return {
          date: session.date,
          weekNumber: session.weekNumber,
          sessionId: session.id,
          sets: exerciseData.setsCompleted,
          totalVolume: exerciseData.totalVolume || 0,
          maxWeight: Math.max(...exerciseData.setsCompleted.map(s => s.weight))
        };
      }).filter(Boolean);

      return exerciseHistory;
    } catch (error) {
      console.error('Error getting exercise history:', error);
      throw error;
    }
  }
};

const calculateSessionStats = (session) => {
  let stats = {
    totalVolume: 0,
    totalSets: 0,
    totalReps: 0,
    exercisesCompleted: 0,
    maxWeight: 0
  };

  session.exercisesCompleted.forEach(exercise => {
    let exerciseVolume = 0;
    let exerciseMaxWeight = 0;
    
    exercise.setsCompleted.forEach(set => {
      if (set.isCompleted) {
        const setVolume = set.reps * set.weight;
        stats.totalVolume += setVolume;
        stats.totalSets += 1;
        stats.totalReps += set.reps;
        
        exerciseVolume += setVolume;
        exerciseMaxWeight = Math.max(exerciseMaxWeight, set.weight);
      }
    });

    exercise.totalVolume = exerciseVolume;
    exercise.maxWeight = exerciseMaxWeight;
    
    if (exercise.setsCompleted.some(set => set.isCompleted)) {
      stats.exercisesCompleted += 1;
    }

    stats.maxWeight = Math.max(stats.maxWeight, exerciseMaxWeight);
  });

  stats.avgVolumePerSet = stats.totalSets > 0 ? stats.totalVolume / stats.totalSets : 0;
  
  return stats;
};

const updateProgressStats = async (userId, session) => {
  try {
    for (const exercise of session.exercisesCompleted) {
      const statId = generateId('stat_');
      
      const progressStat = {
        id: statId,
        userId,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        date: session.date,
        weekNumber: session.weekNumber,
        sessionId: session.id,
        planId: session.planId,
        metrics: {
          maxWeight: exercise.maxWeight || 0,
          totalVolume: exercise.totalVolume || 0,
          totalReps: exercise.setsCompleted.reduce((sum, set) => sum + set.reps, 0),
          totalSets: exercise.setsCompleted.length
        }
      };

      await addDoc(collection(db, 'progressStats'), progressStat);
    }
  } catch (error) {
    console.error('Error updating progress stats:', error);
  }
};

const organizeByWeek = (sessions, exerciseId) => {
  const weeklyData = {};
  
  sessions.forEach(session => {
    const weekKey = `Week ${session.weekNumber}`;
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        weekNumber: session.weekNumber,
        date: session.date,
        totalVolume: 0,
        maxWeight: 0,
        totalSessions: 0
      };
    }
    
    const exerciseData = session.exercisesCompleted.find(
      ex => ex.exerciseId === exerciseId
    );
    
    if (exerciseData) {
      weeklyData[weekKey].totalVolume += exerciseData.totalVolume || 0;
      weeklyData[weekKey].maxWeight = Math.max(
        weeklyData[weekKey].maxWeight, 
        exerciseData.maxWeight || 0
      );
      weeklyData[weekKey].totalSessions += 1;
    }
  });
  
  return Object.values(weeklyData)
    .sort((a, b) => a.weekNumber - b.weekNumber);
};

const calculateProgressiveOverload = (currentWeek, previousWeek) => {
  if (!previousWeek || !currentWeek) return 0;
  
  if (previousWeek.totalVolume === 0) return 100; 
  
  const volumeIncrease = ((currentWeek.totalVolume - previousWeek.totalVolume) / previousWeek.totalVolume) * 100;
  return Math.round(volumeIncrease * 100) / 100; 
};

const prepareChartData = (sessions, metric, exerciseId) => {
  const labels = [];
  const data = [];
  
  const weeklyData = {};
  
  sessions.forEach(session => {
    const weekLabel = `Week ${session.weekNumber}`;
    
    if (!weeklyData[weekLabel]) {
      weeklyData[weekLabel] = {
        volume: 0,
        maxWeight: 0,
        totalReps: 0
      };
    }
    
    const exerciseData = session.exercisesCompleted.find(
      ex => ex.exerciseId === exerciseId
    );
    
    if (exerciseData) {
      weeklyData[weekLabel].volume += exerciseData.totalVolume || 0;
      weeklyData[weekLabel].maxWeight = Math.max(
        weeklyData[weekLabel].maxWeight,
        exerciseData.maxWeight || 0
      );
      weeklyData[weekLabel].totalReps += exerciseData.setsCompleted.reduce(
        (sum, set) => sum + set.reps, 0
      );
    }
  });
  
  Object.entries(weeklyData).forEach(([week, stats]) => {
    labels.push(week);
    
    switch (metric) {
      case 'volume':
        data.push(stats.volume);
        break;
      case 'weight':
        data.push(stats.maxWeight);
        break;
      case 'reps':
        data.push(stats.totalReps);
        break;
      default:
        data.push(stats.volume);
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: metric === 'volume' ? 'Total Volume (kg)' : 
               metric === 'weight' ? 'Max Weight (kg)' : 'Total Reps',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };
};