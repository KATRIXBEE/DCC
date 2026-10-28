import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  restaurantName: z.string().min(2, 'Name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Invalid email address'),
  location: z.string().min(2, 'Location is required'),
  volume: z.string().optional(),
  notes: z.string().optional(),
  _hp_company: z.string().optional(), // honeypot
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate honeypot spam protection
    if (body._hp_company && body._hp_company.trim().length > 0) {
      // Honeypot caught a bot — return silently with 200 OK
      return NextResponse.json({
        success: true,
        message: 'Ticket recorded successfully.',
      });
    }

    // 2. Validate payload schema with Zod
    const validatedData = contactSchema.parse(body);

    // 3. Dispatch to katrixbee@gmail.com (simulated / Resend / EmailJS)
    const emailPayload = {
      to: 'katrixbee@gmail.com',
      from: 'dispatch@deccanclean.tech',
      subject: `[DCC B2B INQUIRY] 10-Min Kitchen Swap — ${validatedData.restaurantName}`,
      html: `
        <h2>DCC B2B KITCHEN SWAP REQUEST</h2>
        <p><strong>Restaurant / Kitchen:</strong> ${validatedData.restaurantName}</p>
        <p><strong>Contact Person:</strong> ${validatedData.contactPerson}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Area / Location:</strong> ${validatedData.location}</p>
        <p><strong>Dishwashing Volume:</strong> ${validatedData.volume || 'Not specified'}</p>
        <p><strong>Notes:</strong> ${validatedData.notes || 'None'}</p>
        <hr />
        <p><em>Dispatched automatically by DCC Pune Web Gateway to katrixbee@gmail.com</em></p>
      `,
      timestamp: new Date().toISOString(),
    };

    console.log('[DCC API /api/contact] Dispatched B2B lead to katrixbee@gmail.com:', emailPayload);

    return NextResponse.json({
      success: true,
      ticketId: `DCC-SWAP-${Date.now()}`,
      message: 'Your kitchen swap request has been scheduled with the Pune R&D team.',
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Invalid input data',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process inquiry. Please connect via WhatsApp directly.',
        },
      },
      { status: 500 }
    );
  }
}
