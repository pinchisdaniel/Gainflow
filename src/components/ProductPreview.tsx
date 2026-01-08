import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductPreviewProps {
  flavor: string;
  ingredientCount: number;
  totalCalories: number;
}

const flavorColors: Record<string, string> = {
  "Chocolate Fudge": "#8B4513",
  "Vanilla Dream": "#F5E6D3",
  "Peanut Butter": "#D4A574",
  "Cookies & Cream": "#4A4A4A",
  "Salted Caramel": "#C68E17",
  "Strawberry Bliss": "#FF6B9D",
};

export function ProductPreview({ flavor, ingredientCount, totalCalories }: ProductPreviewProps) {
  const barColor = flavorColors[flavor] || "#8B4513";

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">Preview</Badge>
          <h3>Your Custom Bar</h3>
        </div>

        <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full max-w-md">
              {/* Bar wrapper */}
              <div className="relative">
                {/* Main bar */}
                <div
                  className="h-32 rounded-lg shadow-xl relative overflow-hidden"
                  style={{ backgroundColor: barColor }}
                >
                  {/* Texture overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 gap-1 h-full p-2">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-full" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Wrapper lines */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30" />
                  
                  {/* Brand label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded shadow">
                      <p className="text-xs uppercase tracking-wide">Custom Mass Gainer</p>
                    </div>
                  </div>
                </div>
                
                {/* Shadow */}
                <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/10 blur-md rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600">Ingredients</p>
            <p className="text-2xl">{ingredientCount}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Calories</p>
            <p className="text-2xl">{totalCalories}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
