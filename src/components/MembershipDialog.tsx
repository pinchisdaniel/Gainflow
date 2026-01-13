import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, Crown, Zap, Star } from "lucide-react";
import { Badge } from "./ui/badge";

interface MembershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTier: "none" | "free" | "premium" | "elite";
  onSelectTier: (tier: "free" | "premium" | "elite") => void;
}

const tiers = [
  {
    id: "free" as const,
    name: "Free Member",
    price: "€0",
    period: "forever",
    icon: Star,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300",
    benefits: [
      "5% off all orders",
      "Early access to new flavors",
      "Monthly nutrition tips newsletter",
      "Birthday surprise discount",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium Member",
    price: "€4.99",
    period: "per month",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    popular: true,
    benefits: [
      "15% off all orders",
      "Free shipping on orders 6+ bars",
      "Priority customer support",
      "Exclusive premium flavors access",
      "Personalized nutrition consultation (1x/month)",
      "Member-only promotions",
    ],
  },
  {
    id: "elite" as const,
    name: "Elite Member",
    price: "€9.99",
    period: "per month",
    icon: Crown,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-400",
    benefits: [
      "25% off all orders",
      "Free shipping on all orders",
      "VIP customer support (24/7)",
      "Unlimited nutrition consultations",
      "Custom recipe creation service",
      "Early bird special offers",
      "Exclusive elite-only events",
      "Free surprise bar every month",
    ],
  },
];

export function MembershipDialog({ open, onOpenChange, currentTier, onSelectTier }: MembershipDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">GainFlow Membership</DialogTitle>
          <DialogDescription>
            Choose a membership tier and unlock exclusive benefits and discounts
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isCurrentTier = currentTier === tier.id;
            
            return (
              <Card
                key={tier.id}
                className={`relative p-6 transition-all ${tier.borderColor} border-2 ${
                  isCurrentTier ? "ring-2 ring-black" : ""
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white">
                    Most Popular
                  </Badge>
                )}
                
                <div className={`${tier.bgColor} rounded-lg p-4 mb-4`}>
                  <Icon className={`w-8 h-8 ${tier.color} mb-2`} />
                  <h3 className="mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-gray-600 text-sm">/{tier.period}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {tier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full"
                  variant={isCurrentTier ? "outline" : "default"}
                  disabled={isCurrentTier}
                  onClick={() => {
                    onSelectTier(tier.id);
                    onOpenChange(false);
                  }}
                >
                  {isCurrentTier ? "Current Plan" : "Select Plan"}
                </Button>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 All paid memberships can be cancelled anytime. No hidden fees or commitments.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
