import { useState, useEffect } from "react";
import { FlavorSelector, flavors } from "./components/FlavorSelector";
import { IngredientSelector, ingredients } from "./components/IngredientSelector";
import { NutritionPanel } from "./components/NutritionPanel";
import { ProductPreview } from "./components/ProductPreview";
import { OrderSummary } from "./components/OrderSummary";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { MembershipDialog } from "./components/MembershipDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Dumbbell, Check, UserCircle, Gift, AlertTriangle, Mail, Crown } from "lucide-react";
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
  const [hasShownDiscountDialog, setHasShownDiscountDialog] = useState(false);
  const [showInsufficientIngredientsDialog, setShowInsufficientIngredientsDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [hasSubscribedToNewsletter, setHasSubscribedToNewsletter] = useState(false);
  const [hasNutAllergy, setHasNutAllergy] = useState(false);
  const [allergenicNuts, setAllergenicNuts] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [showMembershipDialog, setShowMembershipDialog] = useState(false);
  const [membershipTier, setMembershipTier] = useState<"none" | "free" | "premium" | "elite">("none");
  const [nutritionistForm, setNutritionistForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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

  // Validation: Check if user has selected sufficient ingredients
  const selectedBaseIngredients = selectedIngredientDetails.filter(i => i.isBase);
  const hasEnoughIngredients = selectedIngredients.length >= 3;
  const hasBaseIngredient = selectedBaseIngredients.length >= 1;
  const hasRequiredSweetener = selectedIngredients.includes("honey") || selectedIngredients.includes("maple");
  
  // Check for at least one nut AND one nut butter
  const pureNuts = ["almonds", "walnuts", "cashews", "hazelnuts", "pistachios", "macadamia"];
  const nutButters = ["cashew-butter", "almond-butter"];
  const allNutIngredients = [...pureNuts, ...nutButters];
  
  const hasNut = pureNuts.some(nutId => selectedIngredients.includes(nutId));
  const hasNutButter = nutButters.some(butterId => selectedIngredients.includes(butterId));
  
  // If user has nut allergy, they can skip nut requirements
  const canProceedToOrder = hasNutAllergy 
    ? hasEnoughIngredients && hasBaseIngredient && hasRequiredSweetener
    : hasEnoughIngredients && hasBaseIngredient && hasRequiredSweetener && hasNut && hasNutButter;

  const handleIngredientToggle = (ingredientId: string) => {
    // Prevent toggling nut ingredients if user is allergic to them specifically
    if (allergenicNuts.includes(ingredientId)) {
      const ingredient = ingredients.find(i => i.id === ingredientId);
      toast.error("Allergy Alert", {
        description: `You cannot select ${ingredient?.name} as you've indicated an allergy to it.`,
      });
      return;
    }
    
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };
  
  const handleNutAllergyToggle = (checked: boolean) => {
    setHasNutAllergy(checked);
    
    // Clear allergenic nuts selection when unchecking
    if (!checked) {
      setAllergenicNuts([]);
    }
  };
  
  const handleAllergenicNutToggle = (nutId: string) => {
    setAllergenicNuts((prev) => {
      const newAllergies = prev.includes(nutId)
        ? prev.filter((id) => id !== nutId)
        : [...prev, nutId];
      
      // Remove newly allergenic ingredients from selected ingredients
      if (!prev.includes(nutId) && selectedIngredients.includes(nutId)) {
        setSelectedIngredients((current) => current.filter(id => id !== nutId));
        toast.info("Ingredient Removed", {
          description: `${ingredients.find(i => i.id === nutId)?.name} has been removed from your selection.`,
        });
      }
      
      return newAllergies;
    });
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
    if (!canProceedToOrder) {
      setShowInsufficientIngredientsDialog(true);
    } else {
      setShowThankYouDialog(true);
    }
  };

  const handleContactNutritionist = () => {
    setShowNutritionistDialog(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed!", {
        description: `Thank you! Use promo code FIRST10 for 10% off your first order.`,
      });
      setEmail("");
      setHasSubscribedToNewsletter(true);
    }
  };

  const handleNextTab = () => {
    if (activeTab === "flavor") {
      setActiveTab("ingredients");
    } else if (activeTab === "ingredients") {
      // Validate ingredients before proceeding
      if (!canProceedToOrder) {
        setShowInsufficientIngredientsDialog(true);
      } else {
        setActiveTab("order");
      }
    }
  };

  // Show discount dialog when navigating to order tab for the first time
  useEffect(() => {
    if (activeTab === "order" && !hasShownDiscountDialog) {
      setShowDiscountDialog(true);
      setHasShownDiscountDialog(true);
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
                <p>€4.99/bar</p>
              </div>
              <Button 
                variant={membershipTier !== "none" ? "default" : "outline"} 
                onClick={() => setShowMembershipDialog(true)} 
                className="gap-2"
              >
                <Crown className="w-4 h-4" />
                {membershipTier === "none" ? "Become a Member" : `${membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Member`}
              </Button>
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
                  hasNutAllergy={hasNutAllergy}
                  onNutAllergyToggle={handleNutAllergyToggle}
                  allergenicNuts={allergenicNuts}
                  onAllergenicNutToggle={handleAllergenicNutToggle}
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
                  hasSubscribedToNewsletter={hasSubscribedToNewsletter}
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
                Orders of 8+ bars ship free. Delivered in 3-5 business days.
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
              <form onSubmit={handleSubscribe} className="flex gap-2 mb-6">
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
              <Button 
                variant="outline" 
                onClick={() => setShowContactDialog(true)}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </Button>
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

      {/* Insufficient Ingredients Dialog */}
      <Dialog open={showInsufficientIngredientsDialog} onOpenChange={setShowInsufficientIngredientsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Cannot Proceed to Checkout
            </DialogTitle>
            <DialogDescription>
              Your bar needs more ingredients to be safe and nutritious.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <div className="text-gray-700">
                  <span className="font-semibold">At least 3 total ingredients</span> 
                  {selectedIngredients.length < 3 && (
                    <span className="text-red-600"> (Currently: {selectedIngredients.length})</span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <div className="text-gray-700">
                  <span className="font-semibold">At least 1 base ingredient</span> (highlighted with amber border)
                  {!hasBaseIngredient && (
                    <span className="text-red-600"> (Currently: 0)</span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <div className="text-gray-700">
                  <span className="font-semibold">At least 1 sweetener</span> (honey or maple)
                  {!hasRequiredSweetener && (
                    <span className="text-red-600"> (Currently: 0)</span>
                  )}
                </div>
              </div>
              {!hasNutAllergy && (
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <div className="text-gray-700">
                    <span className="font-semibold">At least 1 nut and 1 nut butter</span> (almonds, walnuts, cashews, hazelnuts, pistachios, macadamia, cashew-butter, almond-butter)
                    {!hasNut && (
                      <span className="text-red-600"> (Currently: 0 nuts)</span>
                    )}
                    {!hasNutButter && (
                      <span className="text-red-600"> (Currently: 0 nut butters)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 italic">
              {hasNutAllergy ? (
                <span className="text-orange-600 font-semibold">Nut allergy mode is active - nut requirements are waived.</span>
              ) : (
                "Base ingredients include nuts, nut butters, and sweeteners that form the foundation of your bar."
              )}
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={() => {
              setShowInsufficientIngredientsDialog(false);
              setActiveTab("ingredients");
            }}
          >
            Back to Ingredients
          </Button>
        </DialogContent>
      </Dialog>

      {/* Contact Us Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Mail className="w-6 h-6 text-green-600" />
              Contact Us
            </DialogTitle>
            <DialogDescription>
              Get in touch with our support team.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Send Message</TabsTrigger>
              <TabsTrigger value="direct">Direct Contact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="mt-4">
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Message Sent!", {
                    description: "We'll get back to you as soon as possible!",
                  });
                  setContactForm({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                  });
                  setShowContactDialog(false);
                }}
              >
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Name</label>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email</label>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Subject</label>
                  <Input
                    type="text"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Message</label>
                  <Textarea
                    placeholder="Your message..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="direct" className="mt-4">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="mb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-600" />
                      Email
                    </h4>
                    <a 
                      href="mailto:support@gainflow.com" 
                      className="text-blue-600 hover:underline"
                    >
                      support@gainflow.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      We respond within 24 hours
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone
                    </h4>
                    <a 
                      href="tel:+31201234567" 
                      className="text-blue-600 hover:underline"
                    >
                      +31 20 123 4567
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Mon-Fri: 9:00 AM - 6:00 PM (CET)
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="mb-2">Office Hours</h4>
                    <p className="text-sm text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 text-center italic">
                  For urgent matters, please call us directly during business hours.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Membership Dialog */}
      <MembershipDialog
        open={showMembershipDialog}
        onOpenChange={setShowMembershipDialog}
        currentTier={membershipTier}
        onSelectTier={(tier) => {
          setMembershipTier(tier);
          const tierNames = {
            free: "Free",
            premium: "Premium",
            elite: "Elite",
          };
          toast.success("Membership Activated!", {
            description: `Welcome to ${tierNames[tier]} membership! Your benefits are now active.`,
          });
        }}
      />
    </div>
  );
}