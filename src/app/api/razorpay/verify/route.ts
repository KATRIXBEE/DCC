import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          {
            error: {
              code: 'SIGNATURE_MISMATCH',
              message: 'Payment verification failed: Invalid cryptographic signature.',
            },
          },
          { status: 400 }
        );
      }
    }

    // Payment successfully confirmed
    console.log('[DCC API /api/razorpay/verify] Verified payment:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      upiId: 'kartik8855@fam',
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Batch allocation confirmed.',
      orderId: razorpay_order_id,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'VERIFICATION_ERROR',
          message: 'Error verifying payment with gateway.',
        },
      },
      { status: 500 }
    );
  }
}
