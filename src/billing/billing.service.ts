import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  async getPlans() {
    return [
      { id: 'price_free', name: 'Hobby', price: 0, credits: 1000 },
      { id: 'price_pro', name: 'Pro', price: 49, credits: 50000 },
      { id: 'price_business', name: 'Business', price: 199, credits: 250000 },
    ];
  }

  async createCheckoutSession(userId: string, planId: string) {
    // Scaffold implementation for Stripe Checkout
    return { url: `https://mock-stripe-checkout.com/session?user=${userId}&plan=${planId}` };
  }

  async getSubscription(userId: string) {
    return {
      plan: 'Hobby',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async cancelSubscription(userId: string) {
    return { success: true, message: 'Subscription cancelled successfully' };
  }

  async createPortalSession(userId: string) {
    return { url: `https://mock-stripe-billing-portal.com/session?user=${userId}` };
  }
}
