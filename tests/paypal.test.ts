import { generateAccessToken, paypal } from "../src/lib/paypal";

//test to generate the access token from paypal
test("generates token from paypal", async () => {
  const tokenResponse = await generateAccessToken();
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

//test to create paypal order
test("creates paypal order", async () => {
  const token = await generateAccessToken();
  console.log(token);
  const price = 10.0;
  const createOrderResponse = await paypal.createOrder(price);
  console.log(createOrderResponse);
  expect(createOrderResponse).toHaveProperty("id");
  expect(createOrderResponse).toHaveProperty("status");
  expect(createOrderResponse.status).toBe("CREATED");
});

//test to capture payment with a mock order
test("simulate capturing a payment from an order", async () => {
  const orderId = "1000";
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty("status");
  expect(captureResponse.status).toBe("COMPLETED");

  mockCapturePayment.mockRestore();
});
