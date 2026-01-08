import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Plus, Minus } from "lucide-react";

export interface Ingredient {
  id: string;
  name: string;
  category: "protein" | "carbs" | "healthy-fats" | "extras";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  icon: string;
  price: number;
}

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onIngredientToggle: (ingredientId: string) => void;
}

const ingredients: Ingredient[] = [
  { id: "whey", name: "Whey Protein", category: "protein", calories: 120, protein: 25, carbs: 3, fats: 1, icon: "💪", price: 1.99 },
  { id: "casein", name: "Casein", category: "protein", calories: 110, protein: 24, carbs: 3, fats: 1, icon: "🥛", price: 2.25 },
  { id: "pea", name: "Pea Protein", category: "protein", calories: 100, protein: 20, carbs: 5, fats: 2, icon: "🌱", price: 1.75 },
  { id: "oats", name: "Rolled Oats", category: "carbs", calories: 150, protein: 5, carbs: 27, fats: 3, icon: "🌾", price: 0.50 },
  { id: "dates", name: "Dates", category: "carbs", calories: 80, protein: 1, carbs: 21, fats: 0, icon: "🍇", price: 0.75 },
  { id: "honey", name: "Raw Honey", category: "carbs", calories: 64, protein: 0, carbs: 17, fats: 0, icon: "🍯", price: 0.60 },
  { id: "almonds", name: "Almonds", category: "healthy-fats", calories: 170, protein: 6, carbs: 6, fats: 15, icon: "🌰", price: 1.25 },
  { id: "coconut", name: "Coconut Flakes", category: "healthy-fats", calories: 100, protein: 1, carbs: 4, fats: 10, icon: "🥥", price: 0.85 },
  { id: "chia", name: "Chia Seeds", category: "healthy-fats", calories: 60, protein: 3, carbs: 5, fats: 4, icon: "⚫", price: 0.95 },
  { id: "cacao", name: "Cacao Nibs", category: "extras", calories: 70, protein: 2, carbs: 4, fats: 6, icon: "🍫", price: 1.10 },
  { id: "goji", name: "Goji Berries", category: "extras", calories: 45, protein: 2, carbs: 9, fats: 0, icon: "🔴", price: 1.50 },
  { id: "collagen", name: "Collagen", category: "extras", calories: 35, protein: 9, carbs: 0, fats: 0, icon: "✨", price: 2.00 },
];

const categoryLabels = {
  protein: "Protein Sources",
  carbs: "Complex Carbs",
  "healthy-fats": "Healthy Fats",
  extras: "Extras & Superfoods",
};

export function IngredientSelector({ selectedIngredients, onIngredientToggle }: IngredientSelectorProps) {
  const categories = ["protein", "carbs", "healthy-fats", "extras"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h3>Customize Ingredients</h3>
        <p className="text-gray-600 mt-1">Build your perfect nutritional profile</p>
      </div>
      
      {categories.map((category) => {
        const categoryIngredients = ingredients.filter((i) => i.category === category);
        
        return (
          <div key={category}>
            <h4 className="mb-3">{categoryLabels[category]}</h4>
            <div className="grid gap-3">
              {categoryIngredients.map((ingredient) => {
                const isSelected = selectedIngredients.includes(ingredient.id);
                
                return (
                  <Card
                    key={ingredient.id}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-black bg-gray-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => onIngredientToggle(ingredient.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={isSelected} />
                      <div className="text-2xl">{ingredient.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p>{ingredient.name}</p>
                          <p className="text-green-600">${ingredient.price.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{ingredient.calories} cal</Badge>
                          <Badge variant="outline">{ingredient.protein}g protein</Badge>
                          <Badge variant="outline">{ingredient.carbs}g carbs</Badge>
                          <Badge variant="outline">{ingredient.fats}g fat</Badge>
                        </div>
                      </div>
                      {isSelected ? (
                        <Minus className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ingredients };