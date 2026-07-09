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

const demoAccounts = [
  {
    id: "demo-coach",
    role: "coach",
    name: "Coach Divine",
    email: "coach@sunwarriorfitness.com",
    password: "SunWarrior2026!"
  },
  {
    id: "demo-client",
    role: "client",
    name: "Marcus Reed",
    email: "client@sunwarriorfitness.com",
    password: "SunWarrior2026!"
  }
];

export function AppProvider({ children }) {
  const [user, setUser] = useLocalStorage("sun-warrior:user", null);
  const [accounts, setAccounts] = useLocalStorage("sun-warrior:accounts", demoAccounts);
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

  function login(role, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const expectedAccount = accounts.find(
      (account) => account.role === role && account.email.toLowerCase() === normalizedEmail
    );

    if (!expectedAccount) {
      throw new Error("We could not find an account for that email.");
    }

    if (password !== expectedAccount.password) {
      throw new Error("The email or password you entered is incorrect.");
    }

    if (role === "coach") {
      setUser({
        id: expectedAccount.id,
        name: expectedAccount.name,
        email: expectedAccount.email,
        role: "coach"
      });
      return;
    }

    setUser({
      id: expectedAccount.id,
      name: expectedAccount.name,
      email: expectedAccount.email,
      role: "client",
      clientId: "client-1"
    });
    setActiveClientId("client-1");
  }

  function createAccount(role, email, password, name) {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error("Please enter your name.");
    }

    if (!normalizedEmail || password.length < 6) {
      throw new Error("Please enter a valid email and a password with at least 6 characters.");
    }

    if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
      throw new Error("An account with that email already exists.");
    }

    const newAccount = {
      id: crypto.randomUUID(),
      role,
      name: trimmedName,
      email: normalizedEmail,
      password
    };

    setAccounts((current) => [...current, newAccount]);

    if (role === "coach") {
      setUser({
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: "coach"
      });
      return;
    }

    setUser({
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
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
    createAccount,
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
