import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import matchaImage from "figma:asset/fbc6f1d41a92692ad96f56db6bb77acab75fb618.png";
import vanillaImage from "figma:asset/9d6ac9dc51da7e3dfad4703eb06daa108725a01c.png";
import forestFruitsImage from "figma:asset/44faeeec300e988671e6ab1257835f416bf9a892.png";

interface ProductPreviewProps {
  flavor: string;
  ingredientCount: number;
  totalCalories: number;
}

const barImages = [
  { src: forestFruitsImage, alt: "Forest Fruits Flavor Bar" },
  { src: vanillaImage, alt: "Vanilla Flavor Bar" },
  { src: matchaImage, alt: "Matcha & Pistachio Flavor Bar" },
];

export function ProductPreview({ flavor, ingredientCount, totalCalories }: ProductPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % barImages.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">Preview</Badge>
          <h3>Your Custom Bar</h3>
        </div>

        <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={barImages[currentImageIndex].src}
              alt={barImages[currentImageIndex].alt}
              className="w-full h-full object-contain transition-opacity duration-500"
            />
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
