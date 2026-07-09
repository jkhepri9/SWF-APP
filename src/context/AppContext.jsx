import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
import { supabase } from "../lib/supabaseClient.js";

const AppContext = createContext(null);
const DEFAULT_CLIENT_ID = "client-1";

function cleanRole(role) {
  return role === "coach" ? "coach" : "client";
}

function getNameFromEmail(email) {
  return email?.split("@")[0]?.replace(/[._-]+/g, " ") || "Sun Warrior";
}

function buildAppUser(authUser, profile = null, fallbackRole = "client") {
  const metadata = authUser?.user_metadata || {};
  const role = cleanRole(profile?.role || metadata.role || fallbackRole);
  const fullName =
    profile?.full_name ||
    metadata.full_name ||
    metadata.display_name ||
    getNameFromEmail(authUser?.email);

  return {
    id: authUser.id,
    supabaseUserId: authUser.id,
    name: fullName,
    email: authUser.email || profile?.email || "",
    role,
    clientId: role === "client" ? profile?.client_id || DEFAULT_CLIENT_ID : undefined
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authNotice, setAuthNotice] = useState("");

  const [clients, setClients] = useLocalStorage("sun-warrior:clients", clientsSeed);
  const [meals, setMeals] = useLocalStorage("sun-warrior:meals", mealsSeed);
  const [workouts, setWorkouts] = useLocalStorage("sun-warrior:workouts", workoutsSeed);
  const [messages, setMessages] = useLocalStorage("sun-warrior:messages", messagesSeed);
  const [habits, setHabits] = useLocalStorage("sun-warrior:habits", habitsSeed);
  const [checkIns, setCheckIns] = useLocalStorage("sun-warrior:checkins", checkInsSeed);
  const [plans, setPlans] = useLocalStorage("sun-warrior:plans", plansSeed);
  const [activeClientId, setActiveClientId] = useLocalStorage("sun-warrior:activeClientId", DEFAULT_CLIENT_ID);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function getOrCreateProfile(authUser, fallbackRole = "client") {
    if (!authUser?.id) return null;

    const metadata = authUser.user_metadata || {};
    const safeRole = cleanRole(metadata.role || fallbackRole);
    const fallbackProfile = {
      id: authUser.id,
      email: authUser.email || "",
      full_name: metadata.full_name || metadata.display_name || getNameFromEmail(authUser.email),
      role: safeRole,
      client_id: safeRole === "client" ? DEFAULT_CLIENT_ID : null
    };

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, client_id")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError) {
      console.warn("Profile lookup failed. Using Auth metadata instead.", profileError);
      setAuthNotice(
        "Your login is working, but the Supabase profiles table is not reachable yet. Run the provided production schema in Supabase."
      );
      return fallbackProfile;
    }

    if (profile) {
      setAuthNotice("");
      return profile;
    }

    const { data: createdProfile, error: upsertError } = await supabase
      .from("profiles")
      .upsert(fallbackProfile, { onConflict: "id" })
      .select("id, email, full_name, role, client_id")
      .single();

    if (upsertError) {
      console.warn("Profile creation failed. Using Auth metadata instead.", upsertError);
      setAuthNotice(
        "Your login is working, but your profile row could not be saved yet. Check Supabase RLS policies."
      );
      return fallbackProfile;
    }

    setAuthNotice("");
    return createdProfile;
  }

  async function loadAuthenticatedUser(authUser, fallbackRole = "client") {
    if (!authUser?.id) {
      setUser(null);
      return null;
    }

    const profile = await getOrCreateProfile(authUser, fallbackRole);
    const appUser = buildAppUser(authUser, profile, fallbackRole);

    setUser(appUser);

    if (appUser.role === "client") {
      setActiveClientId(appUser.clientId || DEFAULT_CLIENT_ID);
    }

    return appUser;
  }

  async function refreshUser(fallbackRole = "client") {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      setUser(null);
      return null;
    }

    return loadAuthenticatedUser(data.user, fallbackRole);
  }

  useEffect(() => {
    let mounted = true;

    async function hydrateSession() {
      setAuthLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !data?.session?.user) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      await loadAuthenticatedUser(data.session.user);

      if (mounted) {
        setAuthLoading(false);
      }
    }

    hydrateSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      await loadAuthenticatedUser(session.user);
      if (mounted) setAuthLoading(false);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const activeClient = useMemo(() => {
    if (user?.role === "client") {
      return clients.find((client) => client.id === user.clientId) || clients[0];
    }

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

  async function logout() {
    await supabase.auth.signOut();
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
    if (!body.trim() || !user) return;

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
    authLoading,
    authNotice,
    refreshUser,
    loadAuthenticatedUser,
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
