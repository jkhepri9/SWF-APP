import { createContext, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import {
  checkInsSeed,
  clientsSeed,
  habitsSeed,
  mealsSeed,
  messagesSeed,
  plansSeed,
  progressSeed,
  workoutsSeed
} from "../data/mockData.js";
import { sumMeals } from "../lib/calculations.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useLocalStorage("sun-warrior:user", null);
  const [clients, setClients] = useLocalStorage("sun-warrior:clients", clientsSeed);
  const [meals, setMeals] = useLocalStorage("sun-warrior:meals", mealsSeed);
  const [workouts, setWorkouts] = useLocalStorage("sun-warrior:workouts", workoutsSeed);
  const [messages, setMessages] = useLocalStorage("sun-warrior:messages", messagesSeed);
  const [habits, setHabits] = useLocalStorage("sun-warrior:habits", habitsSeed);
  const [checkIns, setCheckIns] = useLocalStorage("sun-warrior:checkins", checkInsSeed);
  const [plans, setPlans] = useLocalStorage("sun-warrior:plans", plansSeed);
  const [activeClientId, setActiveClientId] = useLocalStorage("sun-warrior:activeClientId", "client-1");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeClient = useMemo(() => {
    if (user?.role === "client") return clients.find((client) => client.id === user.clientId) || clients[0];
    return clients.find((client) => client.id === activeClientId) || clients[0];
  }, [activeClientId, clients, user]);

  const activeClientMeals = useMemo(
    () => meals.filter((meal) => meal.clientId === activeClient?.id && meal.date === "Today"),
    [meals, activeClient]
  );

  const activeClientWorkouts = useMemo(
    () => workouts.filter((workout) => workout.clientId === activeClient?.id),
    [workouts, activeClient]
  );

  const activeClientHabits = useMemo(
    () => habits.filter((habit) => habit.clientId === activeClient?.id),
    [habits, activeClient]
  );

  const activeTotals = useMemo(() => sumMeals(activeClientMeals), [activeClientMeals]);

  function login(role) {
    if (role === "coach") {
      setUser({
        id: "coach-1",
        name: "Coach Divine",
        email: "coach@example.com",
        role: "coach"
      });
      return;
    }

    setUser({
      id: "client-user-1",
      name: "Marcus Reed",
      email: "marcus@example.com",
      role: "client",
      clientId: "client-1"
    });
    setActiveClientId("client-1");
  }

  function logout() {
    setUser(null);
  }

  function addMeal(meal) {
    setMeals((current) => [
      {
        id: crypto.randomUUID(),
        clientId: activeClient.id,
        date: "Today",
        ...meal
      },
      ...current
    ]);
  }

  function deleteMeal(mealId) {
    setMeals((current) => current.filter((meal) => meal.id !== mealId));
  }

  function addWorkout(workout) {
    setWorkouts((current) => [
      {
        id: crypto.randomUUID(),
        clientId: activeClient.id,
        date: "Today",
        exercises: [],
        ...workout
      },
      ...current
    ]);
  }

  function toggleWorkoutStatus(workoutId) {
    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === workoutId
          ? { ...workout, status: workout.status === "Completed" ? "Planned" : "Completed" }
          : workout
      )
    );
  }

  function sendMessage(body) {
    if (!body.trim()) return;

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        clientId: activeClient.id,
        sender: user.role,
        body: body.trim(),
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      }
    ]);
  }

  function toggleHabit(habitId) {
    setHabits((current) =>
      current.map((habit) => (habit.id === habitId ? { ...habit, done: !habit.done } : habit))
    );
  }

  function addHabit(title) {
    if (!title.trim()) return;
    setHabits((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        clientId: activeClient.id,
        title: title.trim(),
        target: "Daily",
        done: false
      }
    ]);
  }

  function submitCheckIn(checkIn) {
    setCheckIns((current) => [
      {
        id: crypto.randomUUID(),
        clientId: activeClient.id,
        date: "Today",
        ...checkIn
      },
      ...current
    ]);
  }

  function updateClient(clientId, updates) {
    setClients((current) =>
      current.map((client) => (client.id === clientId ? { ...client, ...updates } : client))
    );
  }

  const value = {
    user,
    login,
    logout,
    clients,
    activeClient,
    activeClientId,
    setActiveClientId,
    meals,
    activeClientMeals,
    activeTotals,
    workouts,
    activeClientWorkouts,
    messages,
    habits,
    activeClientHabits,
    checkIns,
    plans,
    progress: progressSeed,
    sidebarOpen,
    setSidebarOpen,
    addMeal,
    deleteMeal,
    addWorkout,
    toggleWorkoutStatus,
    sendMessage,
    toggleHabit,
    addHabit,
    submitCheckIn,
    updateClient
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return value;
}
