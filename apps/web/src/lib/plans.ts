const PLANS = {
    FREE: { amount: 0, currency: '$', interval: 'month' },
    PREMIUM: { amount: 9.99, currency: '$', interval: 'month' },
    PREMIUM_PLUS: { amount: 19.99, currency: '$', interval: 'month' },
} as const;

export default PLANS;
