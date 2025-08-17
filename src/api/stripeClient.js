import { loadStripe } from "@stripe/stripe-js";

// ATTENTION : toujours mettre la clé publique test en dev
export const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY);