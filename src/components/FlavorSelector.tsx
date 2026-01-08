import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

interface FlavorSelectorProps {
  selectedFlavor: string;
  onFlavorChange: (flavor: string) => void;
}

const flavors = [
  { name: "Chocolate Fudge", color: "#8B4513", calories: 320 },
  { name: "Vanilla Dream", color: "#F5E6D3", calories: 310 },
  { name: "Peanut Butter", color: "#D4A574", calories: 350 },
  { name: "Cookies & Cream", color: "#4A4A4A", calories: 330 },
  { name: "Salted Caramel", color: "#C68E17", calories: 340 },
  { name: "Strawberry Bliss", color: "#FF6B9D", calories: 315 },
];

export function FlavorSelector({ selectedFlavor, onFlavorChange }: FlavorSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3>Choose Your Flavor</h3>
        <p className="text-gray-600 mt-1">Select the base flavor for your custom bar</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {flavors.map((flavor) => (
          <Card
            key={flavor.name}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedFlavor === flavor.name ? "ring-2 ring-black" : ""
            }`}
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
            <div>
              <p>{flavor.name}</p>
              <Badge variant="secondary" className="mt-2">
                {flavor.calories} cal
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
