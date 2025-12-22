import nodemailer from 'nodemailer';

// Validate that environment variables are configured
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn('⚠️  GMAIL_USER or GMAIL_APP_PASSWORD not configured in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify connection on initialization
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server ready to send messages');
  }
});

export async function sendVerificationCode(email: string, code: string) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ GMAIL_USER or GMAIL_APP_PASSWORD not configured');
      return false;
    }

    const info = await transporter.sendMail({
      from: `"CoWorking Space" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verification Code - CoWorking Space',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">CoWorking Space</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Verification Code</h2>
            <p style="color: #4b5563; font-size: 16px;">Your verification code is:</p>
            <div style="background: #f3f4f6; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px; border: 2px dashed #2563eb;">
              <h1 style="color: #2563eb; font-size: 48px; margin: 0; letter-spacing: 12px; font-weight: bold;">${code}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">This code expires in 10 minutes.</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `,
      text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    });

    console.log('✅ Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    const err = error as { message?: string; response?: { body?: unknown } };
    console.error('❌ Error sending verification code:', err.message ?? error);
    if (err.response) {
      console.error('Error details:', err.response.body);
    }
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ GMAIL_USER or GMAIL_APP_PASSWORD not configured');
      return false;
    }

    const info = await transporter.sendMail({
      from: `"CoWorking Space" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to CoWorking Space!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome, ${name}!</h1>
          </div>
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #4b5563; font-size: 18px; line-height: 1.6;">We're excited to have you as part of our CoWorking Space community.</p>
            <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin-top: 30px;">Now you can:</p>
            <ul style="color: #4b5563; font-size: 16px; line-height: 2; padding-left: 20px;">
              <li>Book workspaces</li>
              <li>Access all our facilities</li>
              <li>Connect with other professionals</li>
              <li>Enjoy all our services</li>
            </ul>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #1f2937; font-size: 16px; margin: 0; font-weight: 600;">Need help?</p>
              <p style="color: #4b5563; font-size: 14px; margin: 10px 0 0 0;">If you have any questions, don't hesitate to contact us. We're here to help.</p>
            </div>
            <p style="color: #2563eb; font-size: 18px; margin-top: 30px; font-weight: 600;">Have a great day!</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">The CoWorking Space team</p>
          </div>
        </div>
      `,
      text: `Welcome to CoWorking Space, ${name}!\n\nWe're excited to have you as part of our community.\n\nNow you can:\n- Book workspaces\n- Access all our facilities\n- Connect with other professionals\n- Enjoy all our services\n\nIf you have any questions, don't hesitate to contact us.\n\nHave a great day!\n\nThe CoWorking Space team`,
    });

    console.log('✅ Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    const err = error as { message?: string; response?: { body?: unknown } };
    console.error('❌ Error sending welcome email:', err.message ?? error);
    if (err.response) {
      console.error('Error details:', err.response.body);
    }
    return false;
  }
}

export async function sendBookingConfirmation(email: string, name: string, bookingData: {
  space: string;
  date: string;
  time: string;
  phone: string;
}) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ GMAIL_USER or GMAIL_APP_PASSWORD not configured');
      return false;
    }

    const spaceNames: Record<string, string> = {
      'abierto': 'Open Space',
      'privada': 'Private Office',
      'reunion': 'Meeting Room',
      'eventos': 'Event Space'
    };

    const spaceName = spaceNames[bookingData.space] || bookingData.space;

    const info = await transporter.sendMail({
      from: `"CoWorking Space" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Booking Confirmation - CoWorking Space',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Booking Confirmed!</h1>
          </div>
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #4b5563; font-size: 18px; line-height: 1.6;">Hello ${name},</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for your booking! We've received your reservation and will contact you soon to confirm the details.</p>
            
            <div style="background: #f3f4f6; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h2 style="color: #1f2937; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Booking Details:</h2>
              <table style="width: 100%; color: #4b5563; font-size: 16px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Space:</td>
                  <td style="padding: 8px 0;">${spaceName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Date:</td>
                  <td style="padding: 8px 0;">${new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Time:</td>
                  <td style="padding: 8px 0;">${bookingData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Phone:</td>
                  <td style="padding: 8px 0;">${bookingData.phone}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">We'll contact you shortly to finalize your reservation. If you have any questions, please don't hesitate to reach out.</p>
            
            <p style="color: #2563eb; font-size: 18px; margin-top: 30px; font-weight: 600;">Thank you for choosing CoWorking Space!</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">The CoWorking Space team</p>
          </div>
        </div>
      `,
      text: `Booking Confirmation - CoWorking Space\n\nHello ${name},\n\nThank you for your booking! We've received your reservation and will contact you soon to confirm the details.\n\nBooking Details:\n- Space: ${spaceName}\n- Date: ${new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n- Time: ${bookingData.time}\n- Phone: ${bookingData.phone}\n\nWe'll contact you shortly to finalize your reservation. If you have any questions, please don't hesitate to reach out.\n\nThank you for choosing CoWorking Space!\n\nThe CoWorking Space team`,
    });

    console.log('✅ Booking confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    const err = error as { message?: string; response?: { body?: unknown } };
    console.error('❌ Error sending booking confirmation email:', err.message ?? error);
    if (err.response) {
      console.error('Error details:', err.response.body);
    }
    return false;
  }
}

export async function sendBookingNotificationToOwner(bookingData: {
  name: string;
  email: string;
  phone: string;
  space: string;
  date: string;
  time: string;
}) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ GMAIL_USER or GMAIL_APP_PASSWORD not configured');
      return false;
    }

    const ownerEmail = 'alvarodct23@gmail.com';
    const spaceNames: Record<string, string> = {
      'abierto': 'Open Space',
      'privada': 'Private Office',
      'reunion': 'Meeting Room',
      'eventos': 'Event Space'
    };

    const spaceName = spaceNames[bookingData.space] || bookingData.space;

    const info = await transporter.sendMail({
      from: `"CoWorking Space" <${process.env.GMAIL_USER}>`,
      to: ownerEmail,
      subject: `New Booking Request - ${bookingData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">New Booking Request</h1>
          </div>
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #4b5563; font-size: 18px; line-height: 1.6;">You have received a new booking request from your CoWorking Space website.</p>
            
            <div style="background: #f3f4f6; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h2 style="color: #1f2937; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Customer Information:</h2>
              <table style="width: 100%; color: #4b5563; font-size: 16px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Name:</td>
                  <td style="padding: 8px 0;">${bookingData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${bookingData.email}" style="color: #2563eb;">${bookingData.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Phone:</td>
                  <td style="padding: 8px 0;"><a href="tel:${bookingData.phone}" style="color: #2563eb;">${bookingData.phone}</a></td>
                </tr>
              </table>
            </div>

            <div style="background: #f3f4f6; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h2 style="color: #1f2937; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Booking Details:</h2>
              <table style="width: 100%; color: #4b5563; font-size: 16px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Space:</td>
                  <td style="padding: 8px 0;">${spaceName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Date:</td>
                  <td style="padding: 8px 0;">${new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">Time:</td>
                  <td style="padding: 8px 0;">${bookingData.time}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Please contact the customer to confirm this booking.</p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">CoWorking Space Booking System</p>
          </div>
        </div>
      `,
      text: `New Booking Request\n\nYou have received a new booking request from your CoWorking Space website.\n\nCustomer Information:\n- Name: ${bookingData.name}\n- Email: ${bookingData.email}\n- Phone: ${bookingData.phone}\n\nBooking Details:\n- Space: ${spaceName}\n- Date: ${new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n- Time: ${bookingData.time}\n\nPlease contact the customer to confirm this booking.\n\nCoWorking Space Booking System`,
    });

    console.log('✅ Booking notification email sent to owner:', info.messageId);
    return true;
  } catch (error) {
    const err = error as { message?: string; response?: { body?: unknown } };
    console.error('❌ Error sending booking notification email:', err.message ?? error);
    if (err.response) {
      console.error('Error details:', err.response.body);
    }
    return false;
  }
}

