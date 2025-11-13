import { Resend } from "resend";
import { ENV } from "./env.js";

// Initializing Resend client
export const resendClient = new Resend(ENV.RESEND_API_KEY);

// Configuring sender details
export const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};
