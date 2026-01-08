import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface NutritionPanelProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  quantity: number;
}

export function NutritionPanel({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFats,
  quantity,
}: NutritionPanelProps) {
  const total = totalProtein + totalCarbs + totalFats;
  const proteinPercent = total > 0 ? (totalProtein / total) * 100 : 0;
  const carbsPercent = total > 0 ? (totalCarbs / total) * 100 : 0;
  const fatsPercent = total > 0 ? (totalFats / total) * 100 : 0;

  return (
    <Card className="p-6 sticky top-4">
      <div className="space-y-6">
        <div>
          <h3>Nutrition Facts</h3>
          <p className="text-gray-600 mt-1">Per bar</p>
        </div>

        <div className="bg-black text-white p-6 rounded-lg text-center">
          <p className="text-gray-300 mb-1">Total Calories</p>
          <p className="text-5xl">{totalCalories}</p>
          <p className="text-gray-300 mt-1">kcal</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Protein</span>
              <span>{totalProtein}g</span>
            </div>
            <Progress value={proteinPercent} className="h-2" />
            <p className="text-gray-600 mt-1">{proteinPercent.toFixed(0)}% of macros</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Carbs</span>
              <span>{totalCarbs}g</span>
            </div>
            <Progress value={carbsPercent} className="h-2" />
            <p className="text-gray-600 mt-1">{carbsPercent.toFixed(0)}% of macros</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Fats</span>
              <span>{totalFats}g</span>
            </div>
            <Progress value={fatsPercent} className="h-2" />
            <p className="text-gray-600 mt-1">{fatsPercent.toFixed(0)}% of macros</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span>Quantity</span>
            <Badge>{quantity} {quantity === 1 ? "bar" : "bars"}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Total Calories</span>
            <span>{totalCalories * quantity} kcal</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
