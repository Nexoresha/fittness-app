import AsyncStorage from "@react-native-async-storage/async-storage";

export const getWorkouts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@workouts");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveWorkout = async (workout) => {
  try {
    const current = await getWorkouts();
    const updated = [workout, ...current];
    await AsyncStorage.setItem("@workouts", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
  }
};

export const getGoals = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@goals");
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    return {};
  }
};

export const saveGoals = async (goals) => {
  try {
    await AsyncStorage.setItem("@goals", JSON.stringify(goals));
  } catch (e) {
    console.error(e);
  }
};

export const calculateStreak = (workouts) => {
  if (!workouts || workouts.length === 0) return 0;
  
  // Sort by date descending
  const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Extract unique dates as 'YYYY-MM-DD' strings
  const dates = [...new Set(sorted.map(w => new Date(w.date).toISOString().split('T')[0]))];
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Check if today or yesterday is the start of the streak
  if (dates[0] !== today && dates[0] !== yesterday) {
    return 0; // Streak broken
  }
  
  let currentDate = new Date(dates[0]);

  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    const diffTime = Math.abs(currentDate - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 1) { // Same day or previous day
      streak++;
      currentDate = d;
    } else {
      break;
    }
  }
  
  // Correct simple logical over-counting if same date exists, but we used Set above.
  return streak;
};

// Nutrition functions
export const getNutrition = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@nutrition");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveNutrition = async (food) => {
  try {
    const current = await getNutrition();
    const updated = [food, ...current];
    await AsyncStorage.setItem("@nutrition", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
  }
};

// Water functions
export const getWater = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@water");
    return jsonValue != null ? JSON.parse(jsonValue) : { count: 0, date: new Date().toISOString().split('T')[0] };
  } catch (e) {
    return { count: 0, date: new Date().toISOString().split('T')[0] };
  }
};

export const saveWater = async (water) => {
  try {
    await AsyncStorage.setItem("@water", JSON.stringify(water));
  } catch (e) {
    console.error(e);
  }
};

// BMI functions
export const getBMI = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@bmi");
    return jsonValue != null ? JSON.parse(jsonValue) : { height: '', weight: '', bmi: null, category: '' };
  } catch (e) {
    return { height: '', weight: '', bmi: null, category: '' };
  }
};

export const saveBMI = async (bmiData) => {
  try {
    await AsyncStorage.setItem("@bmi", JSON.stringify(bmiData));
  } catch (e) {
    console.error(e);
  }
};

// Steps functions
export const getSteps = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@steps");
    return jsonValue != null ? JSON.parse(jsonValue) : { count: 0, date: new Date().toISOString().split('T')[0] };
  } catch (e) {
    return { count: 0, date: new Date().toISOString().split('T')[0] };
  }
};

export const saveSteps = async (steps) => {
  try {
    await AsyncStorage.setItem("@steps", JSON.stringify(steps));
  } catch (e) {
    console.error(e);
  }
};

// Sleep functions
export const getSleep = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@sleep");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveSleep = async (sleep) => {
  try {
    const current = await getSleep();
    const updated = [sleep, ...current];
    await AsyncStorage.setItem("@sleep", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
  }
};

// Motivation quotes
export const MOTIVATION_QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Push yourself because no one else is going to do it for you.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Your body can do it. It's your mind you have to convince.",
  "The hardest lift of all is lifting your butt off the couch.",
];

// Measurements functions
export const getMeasurements = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@measurements");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveMeasurements = async (measurement) => {
  try {
    const current = await getMeasurements();
    const updated = [measurement, ...current];
    await AsyncStorage.setItem("@measurements", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
  }
};
