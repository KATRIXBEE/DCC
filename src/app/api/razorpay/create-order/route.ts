import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createOrderSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  receipt: z.string().optional(),
  customer: z
    .object({
      name: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string(),
      city: z.string(),
      pincode: z.string(),
    })
    .optional(),
  items: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createOrderSchema.parse(body);

    const amountInPaise = Math.round(data.amount * 100);
    const receiptId = data.receipt || `dcc_rec_${Date.now()}`;
    const orderId = `order_dcc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Key configuration from environment
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const upiRoutingId = 'kartik8855@fam';

    // Log simulated/live order creation
    console.log('[DCC API /api/razorpay/create-order] Generated order payload:', {
      orderId,
      amountInPaise,
      currency: data.currency,
      receiptId,
      upiRoutingId,
      customer: data.customer?.name,
    });

    const orderResponse = {
      id: orderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: data.currency,
      receipt: receiptId,
      status: 'created',
      attempts: 0,
      notes: {
        brand: 'Deccan Clean Tech (DCC)',
        upi_receiver: upiRoutingId,
        customer_phone: data.customer?.phone || '',
      },
      created_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({
      success: true,
      order: orderResponse,
      keyId: razorpayKeyId,
      upiId: upiRoutingId,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Invalid order parameters',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'ORDER_CREATION_FAILED',
          message: 'Unable to initialize checkout order.',
        },
      },
      { status: 500 }
    );
  }
}
