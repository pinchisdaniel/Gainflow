import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { ingredients } from "./IngredientSelector";

interface OrderSummaryProps {
  flavor: string;
  selectedIngredients: string[];
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onCheckout: () => void;
}

export function OrderSummary({
  flavor,
  selectedIngredients,
  quantity,
  onQuantityChange,
  onCheckout,
}: OrderSummaryProps) {
  const pricePerBar = 4.99;
  const selectedIngredientDetails = ingredients.filter((i) =>
    selectedIngredients.includes(i.id)
  );
  
  // Calculate ingredient costs
  const ingredientsCost = selectedIngredientDetails.reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );
  
  const totalPerBar = pricePerBar + ingredientsCost;
  const subtotal = totalPerBar * quantity;
  const shipping = quantity >= 12 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <h3>Order Summary</h3>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-gray-600">Flavor</p>
            <p>{flavor}</p>
          </div>

          <div>
            <p className="text-gray-600 mb-2">Ingredients ({selectedIngredients.length})</p>
            <div className="space-y-2">
              {selectedIngredientDetails.map((ingredient) => (
                <div key={ingredient.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{ingredient.icon}</span>
                    <span>{ingredient.name}</span>
                  </div>
                  <span className="text-gray-600">${ingredient.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <span>Quantity</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onQuantityChange(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Price per bar</span>
              <span>${pricePerBar.toFixed(2)}</span>
            </div>
            {ingredientsCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Ingredients cost</span>
                <span>${ingredientsCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            {quantity >= 12 && (
              <div className="flex items-center gap-2 text-green-600">
                <Sparkles className="w-4 h-4" />
                <span>Free shipping unlocked!</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-4">
            <span>Total</span>
            <span className="text-2xl">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={onCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Card>
  );
}