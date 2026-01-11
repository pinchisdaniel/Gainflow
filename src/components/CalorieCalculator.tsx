import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calculator } from "lucide-react";

interface CalorieCalculatorProps {
  caloriesPerBar: number;
}

export function CalorieCalculator({ caloriesPerBar }: CalorieCalculatorProps) {
  const [dailyGoal, setDailyGoal] = useState("");
  const [currentIntake, setCurrentIntake] = useState("");
  const [barsNeeded, setBarsNeeded] = useState<number | null>(null);

  const calculateBars = () => {
    const goal = parseFloat(dailyGoal);
    const current = parseFloat(currentIntake);
    
    if (isNaN(goal) || isNaN(current)) {
      return;
    }
    
    const caloriesNeeded = goal - current;
    
    if (caloriesNeeded <= 0) {
      setBarsNeeded(0);
      return;
    }
    
    const bars = Math.ceil(caloriesNeeded / caloriesPerBar);
    setBarsNeeded(bars);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5" />
        <h3>Daily Calorie Calculator</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Select your ingredients first, then calculate how many bars you need to reach your daily calorie goal.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Daily Calorie Goal
          </label>
          <Input
            type="number"
            placeholder="e.g., 3000"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Current Daily Intake
          </label>
          <Input
            type="number"
            placeholder="e.g., 2000"
            value={currentIntake}
            onChange={(e) => setCurrentIntake(e.target.value)}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={calculateBars}
          disabled={!dailyGoal || !currentIntake}
        >
          Calculate Bars Needed
        </Button>
        
        {barsNeeded !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">You need</p>
              <p className="text-3xl mb-1">{barsNeeded}</p>
              <p className="text-gray-600 text-sm">
                bar{barsNeeded !== 1 ? "s" : ""} per day
              </p>
              <p className="text-sm text-gray-500 mt-2">
                ({caloriesPerBar} cal per bar)
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}