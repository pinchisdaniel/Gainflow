import { useState, useEffect } from "react";
import { FlavorSelector, flavors } from "./components/FlavorSelector";
import { IngredientSelector, ingredients } from "./components/IngredientSelector";
import { NutritionPanel } from "./components/NutritionPanel";
import { ProductPreview } from "./components/ProductPreview";
import { OrderSummary } from "./components/OrderSummary";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Dumbbell, Check, UserCircle, Gift } from "lucide-react";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [selectedFlavor, setSelectedFlavor] = useState("Chocolate");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    flavors.find(f => f.name === "Chocolate")?.ingredientIds || []
  );
  const [quantity, setQuantity] = useState(6);
  const [activeTab, setActiveTab] = useState("flavor");
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [showNutritionistDialog, setShowNutritionistDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [nutritionistForm, setNutritionistForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  // Calculate nutrition totals
  const selectedFlavorData = flavors.find(f => f.name === selectedFlavor);
  const selectedIngredientDetails = ingredients.filter((i) =>
    selectedIngredients.includes(i.id)
  );

  // Calculate nutrition values dynamically based on selected ingredients
  const totalCalories = selectedIngredientDetails.reduce((sum, ing) => sum + ing.calories, 0);
  const totalProtein = selectedIngredientDetails.reduce((sum, ing) => sum + ing.protein, 0);
  const totalCarbs = selectedIngredientDetails.reduce((sum, ing) => sum + ing.carbs, 0);
  const totalFats = selectedIngredientDetails.reduce((sum, ing) => sum + ing.fats, 0);

  const handleIngredientToggle = (ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavor(flavor);
    // Automatically select the ingredients for this flavor
    const flavorData = flavors.find(f => f.name === flavor);
    if (flavorData) {
      setSelectedIngredients(flavorData.ingredientIds);
    }
  };

  const handleCheckout = () => {
    setShowThankYouDialog(true);
  };

  const handleContactNutritionist = () => {
    setShowNutritionistDialog(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed!", {
        description: `We'll send nutrition tips and exclusive offers to ${email}`,
      });
      setEmail("");
    }
  };

  const handleNextTab = () => {
    if (activeTab === "flavor") {
      setActiveTab("ingredients");
    } else if (activeTab === "ingredients") {
      setActiveTab("order");
    }
  };

  // Show discount dialog when navigating to order tab for the first time
  useEffect(() => {
    if (activeTab === "order" && !showDiscountDialog) {
      setShowDiscountDialog(true);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-2 rounded-lg">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h1>GainFlow</h1>
                <p className="text-gray-600">Custom Mass Gainer Bars</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <p className="text-gray-600">Starting at</p>
                <p>$4.99/bar</p>
              </div>
              <Button variant="outline" onClick={handleContactNutritionist} className="gap-2">
                <UserCircle className="w-4 h-4" />
                Contact Nutritionist
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert className="mb-6 bg-black text-white border-black">
          <Check className="h-4 w-4" />
          <AlertDescription>
            Build your perfect mass gainer bar with custom flavors and ingredients tailored to your goals.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Customization */}
          <div className="lg:col-span-2 space-y-6">
            <ProductPreview
              flavor={selectedFlavor}
              ingredientCount={selectedIngredients.length}
              totalCalories={totalCalories}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="flavor">Flavor</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="order">Order</TabsTrigger>
              </TabsList>

              <TabsContent value="flavor" className="space-y-6 mt-6">
                <FlavorSelector
                  selectedFlavor={selectedFlavor}
                  onFlavorChange={handleFlavorChange}
                />
                <Button className="w-full" size="lg" onClick={handleNextTab}>
                  Continue to Ingredients
                </Button>
              </TabsContent>

              <TabsContent value="ingredients" className="space-y-6 mt-6">
                <IngredientSelector
                  selectedIngredients={selectedIngredients}
                  onIngredientToggle={handleIngredientToggle}
                />
                <Button className="w-full" size="lg" onClick={handleNextTab}>
                  Continue to Order
                </Button>
              </TabsContent>

              <TabsContent value="order" className="space-y-6 mt-6">
                <OrderSummary
                  flavor={selectedFlavor}
                  selectedIngredients={selectedIngredients}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onCheckout={handleCheckout}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Nutrition Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <NutritionPanel
                totalCalories={totalCalories}
                totalProtein={totalProtein}
                totalCarbs={totalCarbs}
                totalFats={totalFats}
                quantity={quantity}
              />
              <CalorieCalculator caloriesPerBar={totalCalories} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="mb-3">Why GainFlow?</h4>
              <p className="text-gray-600">
                100% customizable mass gainer bars made fresh to order with premium ingredients.
              </p>
            </div>
            <div>
              <h4 className="mb-3">Free Shipping</h4>
              <p className="text-gray-600">
                Orders of 12+ bars ship free. Delivered in 3-5 business days.
              </p>
            </div>
            <div>
              <h4 className="mb-3">Quality Promise</h4>
              <p className="text-gray-600">
                No artificial sweeteners, colors, or preservatives. Just real food.
              </p>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="border-t border-gray-200 pt-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-gray-600 mb-4">Get nutrition tips, recipes, and exclusive offers delivered to your inbox.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* Thank You Dialog */}
      <Dialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              Thank You for Your Order!
            </DialogTitle>
            <div className="space-y-3 pt-4 text-sm text-gray-600">
              <p>Your custom GainFlow bars are being prepared with care.</p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order:</span>
                  <span className="text-gray-900">{quantity} custom bars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flavor:</span>
                  <span className="text-gray-900">{selectedFlavor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="text-gray-900">3-5 business days</span>
                </div>
              </div>
              <p className="text-center pt-2">A confirmation email has been sent to your inbox.</p>
            </div>
          </DialogHeader>
          <Button className="w-full" onClick={() => setShowThankYouDialog(false)}>
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>

      {/* Nutritionist Contact Dialog */}
      <Dialog open={showNutritionistDialog} onOpenChange={setShowNutritionistDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-green-600" />
              Contact a Nutritionist
            </DialogTitle>
            <DialogDescription>
              Get personalized nutrition advice from our team.
            </DialogDescription>
          </DialogHeader>
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Request Submitted!", {
                description: "Our nutrition team will reach out to you within 24 hours!",
              });
              setNutritionistForm({
                name: "",
                email: "",
                phone: "",
                description: "",
              });
              setShowNutritionistDialog(false);
            }}
          >
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Name</label>
              <Input
                type="text"
                placeholder="Your Name"
                value={nutritionistForm.name}
                onChange={(e) => setNutritionistForm({ ...nutritionistForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="Your Email"
                value={nutritionistForm.email}
                onChange={(e) => setNutritionistForm({ ...nutritionistForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Phone</label>
              <Input
                type="tel"
                placeholder="Your Phone"
                value={nutritionistForm.phone}
                onChange={(e) => setNutritionistForm({ ...nutritionistForm, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">What can we help you with?</label>
              <Textarea
                placeholder="Tell us about your nutrition goals and questions..."
                value={nutritionistForm.description}
                onChange={(e) => setNutritionistForm({ ...nutritionistForm, description: e.target.value })}
                required
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* First-Time Customer Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Gift className="w-6 h-6 text-green-600" />
              Welcome, First-Time Customer!
            </DialogTitle>
            <DialogDescription>
              Exclusive offer for new GainFlow customers
            </DialogDescription>
            <div className="space-y-3 pt-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300 text-center">
                <p className="text-3xl font-bold text-green-700 mb-2">10% OFF</p>
                <p className="text-gray-700">Your First Purchase</p>
              </div>
              <p className="text-gray-600 text-sm text-center">
                Subscribe to our newsletter at the bottom of this page to receive your exclusive <span className="font-bold text-black">FIRST10</span> promo code and save 10% on your first order!
              </p>
            </div>
          </DialogHeader>
          <Button className="w-full" onClick={() => setShowDiscountDialog(false)}>
            Got it, thanks!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}