export function sumMeals(meals) {
  return meals.reduce(
    (totals, meal) => {
      totals.calories += Number(meal.calories || 0);
      totals.protein += Number(meal.protein || 0);
      totals.carbs += Number(meal.carbs || 0);
      totals.fat += Number(meal.fat || 0);
      totals.fiber += Number(meal.fiber || 0);
      totals.sodium += Number(meal.sodium || 0);
      totals.potassium += Number(meal.potassium || 0);
      totals.iron += Number(meal.iron || 0);
      totals.calcium += Number(meal.calcium || 0);
      totals.vitaminD += Number(meal.vitaminD || 0);
      totals.magnesium += Number(meal.magnesium || 0);
      totals.zinc += Number(meal.zinc || 0);
      return totals;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
      potassium: 0,
      iron: 0,
      calcium: 0,
      vitaminD: 0,
      magnesium: 0,
      zinc: 0
    }
  );
}

export function percentage(value, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((Number(value || 0) / Number(target)) * 100));
}

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function calculateCompliance({ mealsTotal, client, workouts, habits }) {
  const calorieScore = 100 - Math.min(100, Math.abs(mealsTotal.calories - client.caloriesTarget) / client.caloriesTarget * 100);
  const proteinScore = percentage(mealsTotal.protein, client.proteinTarget);
  const workoutCompleted = workouts.some((workout) => workout.clientId === client.id && workout.date === "Today" && workout.status === "Completed");
  const workoutScore = workoutCompleted ? 100 : 35;
  const habitScore = habits.length ? (habits.filter((habit) => habit.done).length / habits.length) * 100 : 75;

  return Math.round(clamp((calorieScore * 0.3) + (proteinScore * 0.3) + (workoutScore * 0.25) + (habitScore * 0.15)));
}

export function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number(number || 0)));
}
