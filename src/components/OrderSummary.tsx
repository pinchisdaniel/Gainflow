import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Minus, Plus, ShoppingCart, Sparkles, Tag } from "lucide-react";
import { ingredients } from "./IngredientSelector";
import { flavors } from "./FlavorSelector";
import { useState } from "react";

interface OrderSummaryProps {
  flavor: string;
  selectedIngredients: string[];
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onCheckout: () => void;
  hasSubscribedToNewsletter: boolean;
}

export function OrderSummary({
  flavor,
  selectedIngredients,
  quantity,
  onQuantityChange,
  onCheckout,
  hasSubscribedToNewsletter,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");

  const basePricePerBar = 5.00; // Base price for original flavor bar
  
  // Get the original flavor's ingredient list
  const originalFlavor = flavors.find(f => f.name === flavor);
  const originalIngredientIds = originalFlavor?.ingredientIds || [];
  
  const selectedIngredientDetails = ingredients.filter((i) =>
    selectedIngredients.includes(i.id)
  );

  // Calculate ingredient costs only for ADDED ingredients (not in original recipe)
  const addedIngredients = selectedIngredientDetails.filter(
    (ingredient) => !originalIngredientIds.includes(ingredient.id)
  );
  
  const ingredientsCost = addedIngredients.reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );

  const totalPerBar = basePricePerBar + ingredientsCost;
  const subtotal = totalPerBar * quantity;
  const shipping = quantity >= 8 ? 0 : 5.99;

  // Apply promo code discount
  let discount = 0;
  if (appliedPromo === "FIRST10") {
    discount = subtotal * 0.1;
  }

  const total = subtotal + shipping - discount;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "FIRST10") {
      if (!hasSubscribedToNewsletter) {
        setPromoError("Please subscribe to our newsletter to use this promo code");
      } else {
        setAppliedPromo(code);
        setPromoError("");
      }
    } else if (code === "") {
      setPromoError("Please enter a promo code");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

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
              {selectedIngredientDetails.map((ingredient) => {
                const isIncludedInBase = originalIngredientIds.includes(ingredient.id);
                return (
                  <div key={ingredient.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{ingredient.icon}</span>
                      <span>{ingredient.name}</span>
                      {isIncludedInBase && (
                        <Badge variant="secondary" className="text-xs">Included</Badge>
                      )}
                    </div>
                    <span className="text-gray-600">
                      {isIncludedInBase ? "—" : `€${ingredient.price.toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
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
              <span>€{basePricePerBar.toFixed(2)}</span>
            </div>
            {ingredientsCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Ingredients cost</span>
                <span>€{ingredientsCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`}</span>
            </div>
            {quantity >= 8 && (
              <div className="flex items-center gap-2 text-green-600">
                <Sparkles className="w-4 h-4" />
                <span>Free shipping unlocked!</span>
              </div>
            )}
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              <span className="font-medium">Have a promo code?</span>
            </div>
            
            {!appliedPromo ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="text-sm text-red-600">{promoError}</p>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 text-white">{appliedPromo}</Badge>
                  <span className="text-sm text-green-700">10% discount applied!</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePromo}
                  className="text-green-700 hover:text-green-800"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Discount Display */}
        {discount > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-green-600">
              <span>Discount (10%)</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-4">
            <span>Total</span>
            <span className="text-2xl">€{total.toFixed(2)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={onCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Card>
  );
}