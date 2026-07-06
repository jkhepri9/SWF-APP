export const clientsSeed = [
  {
    id: "client-1",
    name: "Marcus Reed",
    email: "marcus@example.com",
    goal: "Lose 18 lb while keeping strength",
    status: "On track",
    avatar: "MR",
    caloriesTarget: 2350,
    proteinTarget: 190,
    carbsTarget: 240,
    fatTarget: 70,
    waterTarget: 120,
    stepsTarget: 9000,
    weight: 218,
    startWeight: 226,
    bodyFat: 24,
    adherence: 86,
    unread: 2,
    lastCheckIn: "Sunday",
    notes: "Responds well to direct accountability. Loves simple meal templates."
  },
  {
    id: "client-2",
    name: "Alana Brooks",
    email: "alana@example.com",
    goal: "Build glutes and gain lean mass",
    status: "Needs attention",
    avatar: "AB",
    caloriesTarget: 2550,
    proteinTarget: 165,
    carbsTarget: 310,
    fatTarget: 75,
    waterTarget: 100,
    stepsTarget: 7500,
    weight: 143,
    startWeight: 138,
    bodyFat: 21,
    adherence: 71,
    unread: 4,
    lastCheckIn: "Missed",
    notes: "Needs meal prep ideas with budget-friendly foods."
  },
  {
    id: "client-3",
    name: "David King",
    email: "david@example.com",
    goal: "Drop waist size and improve conditioning",
    status: "Excellent",
    avatar: "DK",
    caloriesTarget: 2200,
    proteinTarget: 180,
    carbsTarget: 210,
    fatTarget: 70,
    waterTarget: 130,
    stepsTarget: 10000,
    weight: 196,
    startWeight: 207,
    bodyFat: 22,
    adherence: 94,
    unread: 0,
    lastCheckIn: "Today",
    notes: "Very consistent. Ready for harder conditioning block."
  }
];

export const mealsSeed = [
  {
    id: "meal-1",
    clientId: "client-1",
    name: "Egg bowl with rice",
    mealType: "Breakfast",
    calories: 620,
    protein: 38,
    carbs: 68,
    fat: 20,
    fiber: 5,
    sodium: 640,
    potassium: 520,
    iron: 4,
    calcium: 140,
    vitaminD: 2,
    magnesium: 70,
    zinc: 3,
    date: "Today"
  },
  {
    id: "meal-2",
    clientId: "client-1",
    name: "Chicken wrap",
    mealType: "Lunch",
    calories: 710,
    protein: 52,
    carbs: 73,
    fat: 22,
    fiber: 8,
    sodium: 980,
    potassium: 690,
    iron: 5,
    calcium: 210,
    vitaminD: 0,
    magnesium: 85,
    zinc: 4,
    date: "Today"
  },
  {
    id: "meal-3",
    clientId: "client-2",
    name: "Greek yogurt parfait",
    mealType: "Breakfast",
    calories: 480,
    protein: 34,
    carbs: 62,
    fat: 10,
    fiber: 7,
    sodium: 160,
    potassium: 610,
    iron: 2,
    calcium: 360,
    vitaminD: 1,
    magnesium: 60,
    zinc: 2,
    date: "Today"
  }
];

export const workoutsSeed = [
  {
    id: "workout-1",
    clientId: "client-1",
    title: "Upper Strength",
    type: "Strength",
    date: "Today",
    status: "Completed",
    duration: 58,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, load: 185 },
      { name: "Pull-ups", sets: 4, reps: 10, load: 0 },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: 12, load: 55 }
    ]
  },
  {
    id: "workout-2",
    clientId: "client-2",
    title: "Lower Body Hypertrophy",
    type: "Strength",
    date: "Today",
    status: "Missed",
    duration: 0,
    exercises: [
      { name: "Hip Thrust", sets: 4, reps: 10, load: 185 },
      { name: "Romanian Deadlift", sets: 3, reps: 10, load: 135 },
      { name: "Bulgarian Split Squat", sets: 3, reps: 12, load: 35 }
    ]
  },
  {
    id: "workout-3",
    clientId: "client-3",
    title: "Zone 2 Cardio",
    type: "Cardio",
    date: "Today",
    status: "Completed",
    duration: 42,
    exercises: [
      { name: "Incline walk", sets: 1, reps: 42, load: 0 }
    ]
  }
];

export const messagesSeed = [
  {
    id: "msg-1",
    clientId: "client-1",
    sender: "coach",
    body: "Great work yesterday. Today I want you locked in on water and protein.",
    time: "8:15 AM"
  },
  {
    id: "msg-2",
    clientId: "client-1",
    sender: "client",
    body: "Bet. I packed my lunch already and I am hitting upper body after work.",
    time: "8:22 AM"
  },
  {
    id: "msg-3",
    clientId: "client-2",
    sender: "client",
    body: "I missed my workout yesterday. Can I move it to tonight?",
    time: "9:04 AM"
  },
  {
    id: "msg-4",
    clientId: "client-3",
    sender: "coach",
    body: "Your conditioning is improving fast. I am adding a harder finisher next week.",
    time: "10:40 AM"
  }
];

export const habitsSeed = [
  { id: "habit-1", clientId: "client-1", title: "Water", target: "120 oz", done: true },
  { id: "habit-2", clientId: "client-1", title: "Steps", target: "9,000", done: false },
  { id: "habit-3", clientId: "client-1", title: "Sleep", target: "7+ hr", done: true },
  { id: "habit-4", clientId: "client-1", title: "Stretching", target: "10 min", done: false }
];

export const checkInsSeed = [
  {
    id: "checkin-1",
    clientId: "client-1",
    date: "This week",
    weight: 218,
    energy: 8,
    sleep: 7,
    stress: 4,
    hunger: 5,
    adherence: 86,
    wins: "Hit protein 5 days in a row.",
    challenges: "Late night snacking twice.",
    questions: "Can I swap rice for potatoes?"
  },
  {
    id: "checkin-2",
    clientId: "client-3",
    date: "This week",
    weight: 196,
    energy: 9,
    sleep: 8,
    stress: 3,
    hunger: 4,
    adherence: 94,
    wins: "Completed all workouts.",
    challenges: "None major.",
    questions: "Ready for more cardio."
  }
];

export const progressSeed = {
  "client-1": {
    weight: [226, 224, 223, 221, 220, 219, 218],
    calories: [2400, 2330, 2380, 2310, 2360, 2290, 2350],
    adherence: [72, 76, 81, 84, 83, 87, 86],
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"]
  },
  "client-2": {
    weight: [138, 139, 139, 140, 141, 142, 143],
    calories: [2210, 2380, 2470, 2500, 2400, 2320, 2480],
    adherence: [69, 74, 76, 72, 70, 68, 71],
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"]
  },
  "client-3": {
    weight: [207, 205, 203, 201, 199, 198, 196],
    calories: [2240, 2210, 2190, 2200, 2160, 2220, 2180],
    adherence: [82, 86, 88, 90, 91, 93, 94],
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"]
  }
};

export const plansSeed = [
  {
    id: "plan-1",
    title: "Lean Cut Foundation",
    type: "Nutrition",
    summary: "High-protein calorie deficit with simple repeatable meals.",
    assignedTo: ["client-1", "client-3"],
    blocks: ["Protein every meal", "2 fruit servings", "3 liters water", "80/20 meals"]
  },
  {
    id: "plan-2",
    title: "Glute Growth Phase 1",
    type: "Workout",
    summary: "Lower-body hypertrophy with progressive overload.",
    assignedTo: ["client-2"],
    blocks: ["2 glute days", "1 upper day", "1 conditioning day", "Weekly load progression"]
  },
  {
    id: "plan-3",
    title: "Busy Client Meal Template",
    type: "Nutrition",
    summary: "Fast meals for clients who do not want complex cooking.",
    assignedTo: [],
    blocks: ["Breakfast template", "Lunch template", "Dinner template", "Snack list"]
  }
];

export const exerciseLibrary = [
  { name: "Push-up", category: "Chest", equipment: "Bodyweight" },
  { name: "Pull-up", category: "Back", equipment: "Bodyweight" },
  { name: "Squat", category: "Legs", equipment: "Barbell" },
  { name: "Romanian Deadlift", category: "Hamstrings", equipment: "Barbell" },
  { name: "Hip Thrust", category: "Glutes", equipment: "Barbell" },
  { name: "Walking Lunges", category: "Legs", equipment: "Dumbbells" },
  { name: "Incline Walk", category: "Cardio", equipment: "Treadmill" },
  { name: "Plank", category: "Core", equipment: "Bodyweight" }
];
