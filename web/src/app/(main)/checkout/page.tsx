"use client"
import { Suspense } from "react";
import CheckoutContent from "@/components/CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}