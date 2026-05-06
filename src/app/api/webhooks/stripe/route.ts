import { NextRequest, NextResponse } from "next/server";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Stripe not configured" },
      { status: 400 },
    );
  }

  //Build the webhook event
  const { default: Stripe } = await import("stripe");
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  );

  //check for successful payment
  if (event.type === "charge.succeeded") {
    const { object } = event.data;

    //Update order status
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    return NextResponse.json({
      message: "updateOrderToPaid was Successful",
    });
  }

  return NextResponse.json({
    message: "event is not charge.succeed",
  });
}
