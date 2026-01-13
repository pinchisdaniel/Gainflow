import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Plus, Minus, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

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
  isBase?: boolean;
  caloriesPer100g: number;
}

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onIngredientToggle: (ingredientId: string) => void;
  hasNutAllergy?: boolean;
  onNutAllergyToggle?: (checked: boolean) => void;
  allergenicNuts?: string[];
  onAllergenicNutToggle?: (nutId: string) => void;
}

const ingredients: Ingredient[] = [
  { id: "whey", name: "Whey Protein", category: "protein", calories: 77, protein: 16, carbs: 2, fats: 1, icon: "💪", price: 1.99, caloriesPer100g: 380 },
  { id: "casein", name: "Casein", category: "protein", calories: 110, protein: 24, carbs: 3, fats: 1, icon: "🥛", price: 2.25, caloriesPer100g: 364 },
  { id: "pea", name: "Pea Protein", category: "protein", calories: 100, protein: 20, carbs: 5, fats: 2, icon: "🌱", price: 1.75, caloriesPer100g: 333 },
  { id: "oats", name: "Rolled Oats", category: "carbs", calories: 150, protein: 5, carbs: 27, fats: 3, icon: "🌾", price: 0.50, caloriesPer100g: 375 },
  { id: "dates", name: "Dates", category: "carbs", calories: 80, protein: 1, carbs: 21, fats: 0, icon: "🍇", price: 0.75, caloriesPer100g: 200 },
  { id: "honey", name: "Raw Honey", category: "carbs", calories: 46, protein: 0, carbs: 12, fats: 0, icon: "🍯", price: 0.60, isBase: true, caloriesPer100g: 304 },
  { id: "maple", name: "Maple Syrup", category: "carbs", calories: 28, protein: 0, carbs: 8, fats: 0, icon: "🍁", price: 0.80, isBase: true, caloriesPer100g: 260 },
  { id: "almonds", name: "Almonds", category: "healthy-fats", calories: 180, protein: 6, carbs: 3, fats: 15, icon: "🌰", price: 1.25, isBase: true, caloriesPer100g: 600 },
  { id: "walnuts", name: "Walnuts", category: "healthy-fats", calories: 163, protein: 4, carbs: 3, fats: 16, icon: "🥜", price: 1.35, isBase: true, caloriesPer100g: 650 },
  { id: "cashews", name: "Cashews", category: "healthy-fats", calories: 185, protein: 5, carbs: 9, fats: 12, icon: "🥜", price: 1.30, isBase: true, caloriesPer100g: 600 },
  { id: "hazelnuts", name: "Hazelnuts", category: "healthy-fats", calories: 98, protein: 3, carbs: 2, fats: 10, icon: "🌰", price: 1.40, isBase: true, caloriesPer100g: 650 },
  { id: "pistachios", name: "Pistachios", category: "healthy-fats", calories: 230, protein: 8, carbs: 14, fats: 18, icon: "🟢", price: 1.50, isBase: true, caloriesPer100g: 575 },
  { id: "macadamia", name: "Macadamia Nuts", category: "healthy-fats", calories: 72, protein: 1, carbs: 2, fats: 8, icon: "🤎", price: 1.85, isBase: true, caloriesPer100g: 720 },
  { id: "coconut", name: "Coconut Flakes", category: "healthy-fats", calories: 100, protein: 1, carbs: 4, fats: 10, icon: "🥥", price: 0.85, caloriesPer100g: 660 },
  { id: "chia", name: "Chia Seeds", category: "healthy-fats", calories: 60, protein: 3, carbs: 5, fats: 4, icon: "⚫", price: 0.95, caloriesPer100g: 490 },
  { id: "cashew-butter", name: "Cashew Butter", category: "healthy-fats", calories: 112, protein: 4, carbs: 6, fats: 9, icon: "🥜", price: 1.20, isBase: true, caloriesPer100g: 567 },
  { id: "almond-butter", name: "Almond Butter", category: "healthy-fats", calories: 112, protein: 5, carbs: 3, fats: 11, icon: "🌰", price: 1.25, isBase: true, caloriesPer100g: 560 },
  { id: "cocoa-powder", name: "Cocoa Powder", category: "extras", calories: 25, protein: 2, carbs: 5, fats: 1, icon: "☕", price: 0.70, caloriesPer100g: 250 },
  { id: "cocoa-butter", name: "Cocoa Butter", category: "extras", calories: 45, protein: 0, carbs: 0, fats: 5, icon: "🟤", price: 1.15, caloriesPer100g: 900 },
  { id: "dark-chocolate", name: "Dark Chocolate", category: "extras", calories: 55, protein: 1, carbs: 5, fats: 5, icon: "🍫", price: 1.30, caloriesPer100g: 550 },
  { id: "white-chocolate", name: "White Chocolate", category: "extras", calories: 54, protein: 0, carbs: 6, fats: 5, icon: "⚪", price: 1.20, isBase: true, caloriesPer100g: 540 },
  { id: "matcha", name: "Matcha Cream", category: "extras", calories: 193, protein: 2, carbs: 18, fats: 15, icon: "🍵", price: 1.60, isBase: true, caloriesPer100g: 550 },
  { id: "vanilla", name: "Vanilla Extract", category: "extras", calories: 12, protein: 0, carbs: 1, fats: 0, icon: "🌼", price: 0.50, caloriesPer100g: 288 },
  { id: "dried-berries", name: "Dried Berries", category: "extras", calories: 15, protein: 0, carbs: 4, fats: 0, icon: "🫐", price: 1.00, caloriesPer100g: 300 },
  { id: "crushed-hazelnuts", name: "Crushed Hazelnuts", category: "extras", calories: 33, protein: 1, carbs: 1, fats: 5, icon: "🌰", price: 0.75, caloriesPer100g: 650 },
  { id: "chopped-pistachios", name: "Chopped Pistachios", category: "extras", calories: 29, protein: 1, carbs: 2, fats: 3, icon: "🟢", price: 0.80, caloriesPer100g: 575 },
];

const categoryLabels = {
  protein: "Protein Sources",
  carbs: "Complex Carbs",
  "healthy-fats": "Healthy Fats",
  extras: "Additional Toppings",
};

export function IngredientSelector({ selectedIngredients, onIngredientToggle, hasNutAllergy, onNutAllergyToggle, allergenicNuts, onAllergenicNutToggle }: IngredientSelectorProps) {
  const categories = ["protein", "carbs", "healthy-fats", "extras"] as const;
  const nutIngredients = ["almonds", "walnuts", "cashews", "hazelnuts", "pistachios", "macadamia", "cashew-butter", "almond-butter", "crushed-hazelnuts", "chopped-pistachios"];

  return (
    <div className="space-y-6">
      <div>
        <h3>Customize Ingredients</h3>
        <p className="text-gray-600 mt-1">Build your perfect nutritional profile</p>
        
        {/* Allergy Warning Alert */}
        <Alert className="mt-3 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <span className="font-semibold">Allergy Warning:</span> Some bars contain nuts. Please check the ingredients carefully.
          </AlertDescription>
        </Alert>
        
        {/* Nut Allergy Checkbox */}
        {onNutAllergyToggle && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-md px-3 py-2">
              <Checkbox 
                id="nut-allergy" 
                checked={hasNutAllergy} 
                onCheckedChange={onNutAllergyToggle}
              />
              <label htmlFor="nut-allergy" className="text-sm cursor-pointer flex-1">
                I have a nut allergy
              </label>
            </div>
            
            {/* Allergenic Nuts Selector - Shows when nut allergy is checked */}
            {hasNutAllergy && onAllergenicNutToggle && allergenicNuts && (
              <Card className="p-4 bg-red-50 border-red-200">
                <h4 className="text-sm mb-3">Select which nuts you're allergic to:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {nutIngredients.map((nutId) => {
                    const ingredient = ingredients.find(i => i.id === nutId);
                    if (!ingredient) return null;
                    
                    return (
                      <div
                        key={nutId}
                        className="flex items-center gap-2 p-2 rounded hover:bg-red-100 cursor-pointer"
                        onClick={() => onAllergenicNutToggle(nutId)}
                      >
                        <Checkbox
                          id={`allergen-${nutId}`}
                          checked={allergenicNuts.includes(nutId)}
                          onCheckedChange={() => onAllergenicNutToggle(nutId)}
                        />
                        <label htmlFor={`allergen-${nutId}`} className="text-sm cursor-pointer flex items-center gap-2">
                          <span className="text-lg">{ingredient.icon}</span>
                          <span>{ingredient.name}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-600 mt-3 italic">
                  Selected nuts will be disabled and removed from your ingredient options
                </p>
              </Card>
            )}
          </div>
        )}
        
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-2">
          💡 <span className="font-semibold">Base ingredients</span> are highlighted with a colored border — these are the primary nuts and sweeteners that form the foundation of your bar
        </p>
      </div>
      
      {categories.map((category) => {
        const categoryIngredients = ingredients.filter((i) => i.category === category);
        
        return (
          <div key={category}>
            <h4 className="mb-3">{categoryLabels[category]}</h4>
            <div className="grid gap-3">
              {categoryIngredients.map((ingredient) => {
                const isSelected = selectedIngredients.includes(ingredient.id);
                const isNutIngredient = nutIngredients.includes(ingredient.id);
                const isAllergenicNut = allergenicNuts?.includes(ingredient.id) || false;
                const isDisabled = isAllergenicNut;
                
                return (
                  <Card
                    key={ingredient.id}
                    className={`p-4 transition-all ${
                      ingredient.isBase ? "border-2 border-amber-400" : ""
                    } ${
                      isSelected ? "ring-2 ring-black bg-gray-50" : "hover:bg-gray-50"
                    } ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() => !isDisabled && onIngredientToggle(ingredient.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={isSelected} disabled={isDisabled} />
                      <div className="text-2xl">{ingredient.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={isDisabled ? "text-gray-400" : ""}>
                              {ingredient.name}
                              {isDisabled && <span className="ml-2 text-xs text-red-600">(Allergic)</span>}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{ingredient.caloriesPer100g} kcal/100g</p>
                          </div>
                          <p className={`${isDisabled ? "text-gray-400" : "text-green-600"}`}>
                            €{ingredient.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{ingredient.calories} cal</Badge>
                          <Badge variant="outline">{ingredient.protein}g protein</Badge>
                          <Badge variant="outline">{ingredient.carbs}g carbs</Badge>
                          <Badge variant="outline">{ingredient.fats}g fat</Badge>
                        </div>
                      </div>
                      {!isDisabled && (
                        isSelected ? (
                          <Minus className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-600" />
                        )
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