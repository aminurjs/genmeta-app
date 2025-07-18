"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import {
  Check,
  Sparkles,
  Shield,
  Zap,
  Laptop,
  AlertCircle,
  XCircle,
  ArrowRight,
  Download,
  Star,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getBaseApi } from "@/services/image-services";
import { Banner } from "@/components/main/banner";

interface SubscriptionPlan {
  _id: string;
  name: string;
  type: string;
  basePrice: number;
  discountPercent: number;
  isActive: boolean;
  planDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface CreditPlan {
  _id: string;
  name: string;
  type: string;
  basePrice: number;
  discountPercent: number;
  isActive: boolean;
  credit: number;
  createdAt: string;
  updatedAt: string;
}

interface PlansResponse {
  success: boolean;
  message: string;
  data: {
    subscriptionPlans: SubscriptionPlan[];
    creditPlans: CreditPlan[];
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

// Component that uses useSearchParams, to be wrapped in Suspense
const PricingContent = () => {
  const [activeTab, setActiveTab] = useState<"subscription" | "credit">(
    "subscription"
  );
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // State for pricing data
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [creditPlans, setCreditPlans] = useState<CreditPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse error message from URL if present
  useEffect(() => {
    if (searchParams) {
      const message = searchParams.get("message");
      if (message) {
        setErrorMessage(decodeURIComponent(message));
      }
    }
  }, [searchParams]);

  // Fetch pricing data
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setIsLoading(true);
        const baseApi = await getBaseApi();
        const response = await fetch(`${baseApi}/pricing/plans`);
        const result = (await response.json()) as PlansResponse;

        if (result.success && result.data) {
          const { subscriptionPlans, creditPlans } = result.data;
          setSubscriptionPlans(subscriptionPlans);
          setCreditPlans(creditPlans);
        }
      } catch (error) {
        console.error("Error fetching pricing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // Plan features
  const freeFeatures = [
    "Limited (10 Images day) — Batch Processing",
    "Use Own API key — Gemini API Integration",
    "Powerful Metadata Editor — Bulk Edits",
    "JPG, JPEG, PNG, EPS — Supported Formats",
    "Basic export options",
    "Limited Results",
  ];

  const premiumFeatures = [
    "Unlimited — Batch Processing",
    "Use Own API key — Gemini API Integration",
    "Powerful Metadata Editor — Bulk Edits",
    "JPG, JPEG, PNG, EPS — Supported Formats",
    "Priority customer support",
    "Unlimited Results",
  ];

  const creditFeatures = [
    "Faster processing — Batch Processing",
    "Powerful Metadata Editor — Bulk Edits",
    "No API required — Built-in API Access",
    "JPG, JPEG, PNG, EPS — Supported Formats",
    "1 credit token per image — Results Generation",
    "Priority customer support",
    "No monthly commitment",
  ];

  // FAQ data
  const faqItems: FaqItem[] = [
    {
      question: "How does the free plan work?",
      answer:
        "The free plan gives you access to basic AI image processing with a limit of 10 images per day. You can process images, generate basic metadata, and export results with standard features.",
    },
    {
      question: "What's the difference between subscription and credit plans?",
      answer:
        "Subscription plans provide unlimited access for a fixed monthly or yearly fee, while credit plans let you pay per use. Credits are perfect if you have irregular usage patterns or want to try the service without a commitment.",
    },
    {
      question: "Can I upgrade from free to premium anytime?",
      answer:
        "Yes, you can upgrade from the free plan to any premium plan at any time. Your account will be upgraded immediately and you'll have access to all premium features.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "We offer a 30-day money-back guarantee for all premium plans. If you're not satisfied with our service, contact our support team within 30 days of purchase for a full refund.",
    },
  ];

  const handlePurchase = (id: string, type: string) => {
    router.push(`/cart?planId=${id}&planType=${type}`);
  };

  const handleDownloadFree = () => {
    router.push("/signup?plan=free");
  };

  const calculateDiscountedPrice = (
    basePrice: number,
    discountPercent: number
  ) => {
    return Math.round(basePrice * (1 - discountPercent / 100));
  };

  // Free Plan Card Component
  const FreePlanCard = () => (
    <Card className="flex flex-col relative overflow-hidden border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
          Free Plan
        </CardTitle>
        <CardDescription>Perfect for getting started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-1">
          <p className="text-4xl font-bold">৳0</p>
          <p className="text-sm text-muted-foreground">Forever free</p>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          {freeFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          className="w-full border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
          size="lg"
          onClick={handleDownloadFree}
        >
          <Download className="mr-2 h-4 w-4" />
          Get Started Free
        </Button>
      </CardFooter>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Laptop className="h-12 w-12 text-violet-600 dark:text-violet-400 mx-auto animate-pulse" />
          <h2 className="text-2xl font-medium">
            Loading pricing information...
          </h2>
        </div>
      </div>
    );
  }

  // Get specific plans
  const monthlyPlan = subscriptionPlans.find(
    (plan) => plan.planDuration === 30
  );
  const yearlyPlan = subscriptionPlans.find(
    (plan) => plan.planDuration === 365
  );
  const basicCreditPlan = creditPlans.find((plan) =>
    plan.name.includes("Basic")
  );
  const proCreditPlan = creditPlans.find((plan) => plan.name.includes("Pro"));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-50 to-background dark:from-violet-950/20 dark:to-background pt-16 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,80,255,0.15),transparent_70%)] -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
              <Sparkles className="h-4 w-4" />
              <span>Start free, upgrade when you need more</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Choose the Perfect Plan <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                for Your Workflow
              </span>
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground">
              Transform your image metadata workflow with our AI-powered
              platform. Start free and scale as your needs grow.
            </p>

            <Tabs
              defaultValue="subscription"
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "subscription" | "credit")
              }
              className="w-full max-w-md mt-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="credit">Credit Plans</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="container mx-auto px-4 -mt-10 mb-10">
          <div className="mx-auto max-w-md">
            <Alert variant="destructive" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{errorMessage}</AlertDescription>
              <button
                onClick={() => setErrorMessage(null)}
                className="absolute right-2 top-2 rounded-full p-1 transition-colors hover:bg-destructive/20"
                aria-label="Close"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </Alert>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 -mt-10">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "subscription" | "credit")
          }
        >
          <TabsContent value="subscription" className="mt-0">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
              {/* Free Plan */}
              <FreePlanCard />

              {/* Monthly Plan */}
              {monthlyPlan && (
                <Card className="flex flex-col relative overflow-hidden border-violet-200 dark:border-violet-800 transition-all hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      Monthly Premium
                    </CardTitle>
                    <CardDescription>Perfect for regular use</CardDescription>
                    {monthlyPlan.discountPercent > 0 && (
                      <Badge className="absolute right-4 top-4 bg-green-500 hover:bg-green-600">
                        {monthlyPlan.discountPercent}% OFF
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-4xl font-bold text-foreground">
                          ৳
                          {calculateDiscountedPrice(
                            monthlyPlan.basePrice,
                            monthlyPlan.discountPercent
                          )}
                        </p>
                        {monthlyPlan.discountPercent > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{monthlyPlan.basePrice}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      {premiumFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-violet-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20"
                      size="lg"
                      onClick={() =>
                        handlePurchase(monthlyPlan._id, "subscription")
                      }
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Get Monthly
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Yearly Plan */}
              {yearlyPlan && (
                <Card className="flex flex-col relative overflow-hidden border-violet-200 dark:border-violet-800 shadow-md transition-all hover:shadow-lg">
                  <div className="absolute -right-10 top-5 rotate-45 bg-gradient-to-r from-violet-600 to-indigo-600 px-10 py-1 text-xs font-semibold text-white">
                    Best Value
                  </div>
                  {yearlyPlan.discountPercent > 0 && (
                    <Badge className="absolute left-4 top-4 bg-green-500 hover:bg-green-600">
                      {yearlyPlan.discountPercent}% OFF
                    </Badge>
                  )}

                  <CardHeader className="mt-6 pb-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Star className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      Yearly Premium
                    </CardTitle>
                    <CardDescription>
                      Best value for committed users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-4xl font-bold text-foreground">
                          ৳
                          {Math.round(
                            calculateDiscountedPrice(
                              yearlyPlan.basePrice,
                              yearlyPlan.discountPercent
                            ) / 12
                          )}
                        </p>
                        {yearlyPlan.discountPercent > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{Math.round(yearlyPlan.basePrice / 12)}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        per month, billed annually
                      </p>
                      <p className="text-xs font-medium text-green-500">
                        Save ৳
                        {yearlyPlan.basePrice -
                          calculateDiscountedPrice(
                            yearlyPlan.basePrice,
                            yearlyPlan.discountPercent
                          )}{" "}
                        per year
                      </p>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      {premiumFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-violet-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20"
                      size="lg"
                      onClick={() =>
                        handlePurchase(yearlyPlan._id, "subscription")
                      }
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Get Yearly - ৳
                      {calculateDiscountedPrice(
                        yearlyPlan.basePrice,
                        yearlyPlan.discountPercent
                      )}
                      /year
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="credit" className="mt-0">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
              {/* Free Plan */}
              <FreePlanCard />

              {/* Basic Credit Plan */}
              {basicCreditPlan && (
                <Card className="flex flex-col relative overflow-hidden border-blue-200 dark:border-blue-800 transition-all hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Basic Plan
                    </CardTitle>
                    <CardDescription>
                      Perfect for occasional use
                    </CardDescription>
                    {basicCreditPlan.discountPercent > 0 && (
                      <Badge className="absolute right-4 top-4 bg-green-500 hover:bg-green-600">
                        {basicCreditPlan.discountPercent}% OFF
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-4xl font-bold text-foreground">
                          ৳
                          {calculateDiscountedPrice(
                            basicCreditPlan.basePrice,
                            basicCreditPlan.discountPercent
                          )}
                        </p>
                        {basicCreditPlan.discountPercent > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{basicCreditPlan.basePrice}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {basicCreditPlan.credit} credits
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          ৳
                          {(
                            basicCreditPlan.basePrice / basicCreditPlan.credit
                          ).toFixed(3)}{" "}
                          per credit
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      {creditFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      size="lg"
                      onClick={() =>
                        handlePurchase(basicCreditPlan._id, "credit")
                      }
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Buy Basic Credits
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Pro Credit Plan */}
              {proCreditPlan && (
                <Card className="flex flex-col relative overflow-hidden border-blue-200 dark:border-blue-800 shadow-md transition-all hover:shadow-lg">
                  <div className="absolute -right-10 top-5 rotate-45 bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-1 text-xs font-semibold text-white">
                    Best Value
                  </div>
                  {proCreditPlan.discountPercent > 0 && (
                    <Badge className="absolute left-4 top-4 bg-green-500 hover:bg-green-600">
                      {proCreditPlan.discountPercent}% OFF
                    </Badge>
                  )}

                  <CardHeader className="mt-6 pb-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Pro Plan
                    </CardTitle>
                    <CardDescription>
                      Best value for heavy users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-4xl font-bold text-foreground">
                          ৳
                          {calculateDiscountedPrice(
                            proCreditPlan.basePrice,
                            proCreditPlan.discountPercent
                          )}
                        </p>
                        {proCreditPlan.discountPercent > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{proCreditPlan.basePrice}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {proCreditPlan.credit} credits
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          ৳
                          {(
                            proCreditPlan.basePrice / proCreditPlan.credit
                          ).toFixed(3)}{" "}
                          per credit
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      {creditFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
                      size="lg"
                      onClick={() =>
                        handlePurchase(proCreditPlan._id, "credit")
                      }
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Buy Pro Credits
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* App Screenshot */}
      <div className="bg-gradient-to-b from-violet-50 to-background dark:from-violet-950/20 dark:to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Powerful AI-Driven Experience
            </h2>

            <div>
              <Banner />
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md border border-violet-100 dark:border-violet-900">
                <div className="mb-4 rounded-full bg-violet-100 dark:bg-violet-900/50 p-3 w-fit">
                  <Zap className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Powerful AI</h3>
                <p className="text-muted-foreground">
                  Process images with state-of-the-art AI technology for
                  accurate and fast results. Generate metadata that improves
                  discoverability.
                </p>
              </div>

              <div className="rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md border border-violet-100 dark:border-violet-900">
                <div className="mb-4 rounded-full bg-violet-100 dark:bg-violet-900/50 p-3 w-fit">
                  <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Secure Processing
                </h3>
                <p className="text-muted-foreground">
                  Your data is processed securely with enterprise-grade
                  encryption. We never store your images or personal data.
                </p>
              </div>

              <div className="rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md border border-violet-100 dark:border-violet-900">
                <div className="mb-4 rounded-full bg-violet-100 dark:bg-violet-900/50 p-3 w-fit">
                  <BarChart3 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Advanced Workflow
                </h3>
                <p className="text-muted-foreground">
                  Streamline your image processing with batch operations, custom
                  metadata editing, and flexible export options for any project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-violet-100 dark:border-violet-900"
              >
                <AccordionTrigger className="text-left hover:text-violet-600 dark:hover:text-violet-400">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-violet-500" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-b from-violet-50 to-background dark:from-violet-950/20 dark:to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-card p-8 shadow-lg border border-violet-200 dark:border-violet-800">
            <div className="text-center">
              <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800">
                Start Free Today
              </Badge>
              <h2 className="mb-4 text-3xl font-bold">
                Ready to transform your workflow?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Join thousands of professionals who use our AI-powered platform
                to streamline their image metadata workflow. Start free and
                upgrade when you need more.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20"
                  asChild
                >
                  <a href="#premium">
                    Get Premium
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30"
                  onClick={handleDownloadFree}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Start Free
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                30-day money-back guarantee. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component to show while the content loads
const PricingLoading = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Laptop className="h-12 w-12 text-violet-600 dark:text-violet-400 mx-auto animate-pulse" />
        <h2 className="text-2xl font-medium">Loading pricing information...</h2>
      </div>
    </div>
  );
};

// Main component that wraps PricingContent in a Suspense boundary
const PricingPage = () => {
  return (
    <Suspense fallback={<PricingLoading />}>
      <PricingContent />
    </Suspense>
  );
};

export default PricingPage;
