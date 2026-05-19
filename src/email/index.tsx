import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import PurchaseReciptEmail from "./purchase-receipt";
import VerificationEmail from "./verification";
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReciptEmail order={order} />,
  });
};

export const sendVerificationEmail = async ({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) => {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: email,
    subject: `Verify your email address for ${APP_NAME}`,
    react: <VerificationEmail name={name} email={email} token={token} />,
  });
};
