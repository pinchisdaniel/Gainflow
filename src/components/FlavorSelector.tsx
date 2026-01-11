import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FlavorSelectorProps {
  selectedFlavor: string;
  onFlavorChange: (flavor: string) => void;
}

interface FlavorIngredient {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Flavor {
  name: string;
  color: string;
  calories: number;
  ingredients: FlavorIngredient[];
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  ingredientIds: string[];
}

const flavors: Flavor[] = [
  { 
    name: "Forest Fruits", 
    color: "#8B4513", 
    calories: 645,
    totalProtein: 31,
    totalFat: 44,
    totalCarbs: 28,
    ingredientIds: ["almonds", "walnuts", "whey", "honey", "cashew-butter", "white-chocolate", "dried-berries"],
    ingredients: [
      { name: "Almonds (ground)", weight: 30, calories: 180, protein: 6, fat: 15, carbs: 6 },
      { name: "Walnuts (ground)", weight: 25, calories: 162.5, protein: 4, fat: 16, carbs: 3 },
      { name: "Whey protein powder", weight: 20, calories: 76, protein: 16, fat: 1, carbs: 2 },
      { name: "Honey", weight: 15, calories: 45.6, protein: 0, fat: 0, carbs: 12 },
      { name: "Cashew butter", weight: 20, calories: 112, protein: 4, fat: 9, carbs: 6 },
      { name: "White chocolate", weight: 10, calories: 54, protein: 0, fat: 3, carbs: 6 },
      { name: "Chopped dried berries", weight: 5, calories: 15, protein: 0, fat: 0, carbs: 4 },
    ]
  },
  { 
    name: "Vanilla Dream", 
    color: "#F5E6D3", 
    calories: 681,
    totalProtein: 34,
    totalFat: 49,
    totalCarbs: 21,
    ingredientIds: ["almonds", "cashews", "whey", "cashew-butter", "maple", "vanilla", "white-chocolate", "crushed-hazelnuts"],
    ingredients: [
      { name: "Almonds", weight: 43, calories: 258, protein: 8, fat: 21, carbs: 4 },
      { name: "Cashews (base)", weight: 11, calories: 66, protein: 3, fat: 6, carbs: 1 },
      { name: "Whey protein", weight: 21, calories: 80, protein: 17, fat: 1, carbs: 2 },
      { name: "Cashew butter", weight: 28.6, calories: 160, protein: 5, fat: 11, carbs: 3 },
      { name: "Maple syrup", weight: 11.4, calories: 30, protein: 0, fat: 0, carbs: 8 },
      { name: "Vanilla extract", weight: 0.5, calories: 1, protein: 0, fat: 0, carbs: 0 },
      { name: "White chocolate", weight: 10, calories: 54, protein: 0, fat: 6, carbs: 6 },
      { name: "Crushed hazelnuts", weight: 5, calories: 32.5, protein: 1, fat: 5, carbs: 1 },
    ]
  },
  { 
    name: "Chocolate", 
    color: "#4A4A4A", 
    calories: 650,
    totalProtein: 34,
    totalFat: 53,
    totalCarbs: 28,
    ingredientIds: ["almonds", "hazelnuts", "whey", "cocoa-powder", "almond-butter", "maple", "cocoa-butter", "dark-chocolate", "crushed-hazelnuts"],
    ingredients: [
      { name: "Almonds", weight: 30, calories: 180, protein: 6, fat: 15, carbs: 3 },
      { name: "Hazelnuts", weight: 15, calories: 97.5, protein: 3, fat: 10, carbs: 2 },
      { name: "Whey protein", weight: 20, calories: 76, protein: 16, fat: 1, carbs: 2 },
      { name: "Cocoa powder", weight: 10, calories: 25, protein: 2, fat: 1, carbs: 5 },
      { name: "Almond butter", weight: 20, calories: 112, protein: 5, fat: 11, carbs: 3 },
      { name: "Maple syrup", weight: 10, calories: 26, protein: 0, fat: 0, carbs: 7 },
      { name: "Cocoa butter", weight: 5, calories: 45, protein: 0, fat: 5, carbs: 0 },
      { name: "Dark chocolate", weight: 10, calories: 55, protein: 1, fat: 5, carbs: 5 },
      { name: "Crushed hazelnuts / cacao nibs", weight: 5, calories: 32.5, protein: 1, fat: 5, carbs: 1 },
    ]
  },
  { 
    name: "Matcha Pistachio", 
    color: "#90C695", 
    calories: 653,
    totalProtein: 28,
    totalFat: 50.5,
    totalCarbs: 43.5,
    ingredientIds: ["pistachios", "macadamia", "whey", "matcha", "white-chocolate", "chopped-pistachios"],
    ingredients: [
      { name: "Pistachios", weight: 40, calories: 230, protein: 8, fat: 18, carbs: 14 },
      { name: "Macadamia", weight: 10, calories: 72, protein: 1, fat: 8, carbs: 2 },
      { name: "Whey protein", weight: 20, calories: 76, protein: 16, fat: 1, carbs: 2 },
      { name: "Matcha cream", weight: 35, calories: 192.5, protein: 2, fat: 15, carbs: 17.5 },
      { name: "White chocolate", weight: 10, calories: 54, protein: 0, fat: 6, carbs: 6 },
      { name: "Chopped pistachios", weight: 5, calories: 28.75, protein: 1, fat: 2.5, carbs: 2 },
    ]
  },
];

export function FlavorSelector({ selectedFlavor, onFlavorChange }: FlavorSelectorProps) {
  const [expandedFlavor, setExpandedFlavor] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h3>Choose Your Flavor</h3>
        <p className="text-gray-600 mt-1">You can order one of these 4 original products as a complete bar, or customize them further by adding or removing ingredients in the Ingredients tab</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {flavors.map((flavor) => (
          <Card
            key={flavor.name}
            className={`overflow-hidden transition-all ${
              selectedFlavor === flavor.name ? "ring-2 ring-black" : ""
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => onFlavorChange(flavor.name)}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: flavor.color }}
                />
                {selectedFlavor === flavor.name && (
                  <div className="bg-black text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p>{flavor.name}</p>
                  <Badge variant="secondary" className="mt-2">
                    {flavor.calories} cal
                  </Badge>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedFlavor(expandedFlavor === flavor.name ? null : flavor.name);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  {expandedFlavor === flavor.name ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {expandedFlavor === flavor.name && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm mb-3">Ingredients Breakdown</h4>
                <div className="space-y-2 text-sm">
                  {flavor.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="flex justify-between text-gray-600">
                      <span>{ingredient.name}</span>
                      <span className="text-gray-500">{ingredient.weight}g</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-300 text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Protein:</span>
                    <span>{flavor.totalProtein}g</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Fat:</span>
                    <span>{flavor.totalFat}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs:</span>
                    <span>{flavor.totalCarbs}g</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export { flavors };
export type { Flavor };