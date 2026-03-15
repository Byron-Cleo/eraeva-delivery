//this is where we initailize the resend library for sending emails
import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import PurchaseReciptEmail from "./purchase-receipt";
require("dotenv").config();

//initailize the resend object
const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReciptEmail order={order} />,
  });
};
