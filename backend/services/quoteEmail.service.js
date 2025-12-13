import nodemailer from 'nodemailer';

/**
 * Send quote email to user with Accept/Decline buttons
 */
export const sendQuoteEmail = async (quote, lead, pricingDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // URLs for accept/decline actions
    const acceptUrl = `${backendUrl}/api/quotes/${quote._id}/accept`;
    const declineUrl = `${backendUrl}/api/quotes/${quote._id}/decline`;

    // Format price
    const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

    // Format date
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `no-reply@${new URL(frontendUrl).hostname}`,
      to: lead.email,
      subject: `Your Travel Quote is Ready! 🎉 - ${quote.event?.name || 'Event'}`,
      html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Travel Quote</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
    table { border-collapse: collapse; }
    .container { width: 100%; max-width: 680px; margin: 0 auto; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(16,24,40,0.06); }
    .header { text-align: center; padding-bottom: 24px; border-bottom: 2px solid #f0f0f0; }
    .logo { font-weight: 700; font-size: 24px; color: #0f172a; text-decoration: none; }
    h1 { margin: 24px 0 12px 0; font-size: 24px; color: #0f172a; }
    p { color: #334155; line-height: 1.6; font-size: 15px; margin: 12px 0; }
    .highlight { background: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .price-box { background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; border: 2px solid #22c55e; }
    .price-label { font-size: 14px; color: #16a34a; font-weight: 600; text-transform: uppercase; }
    .price-amount { font-size: 36px; color: #15803d; font-weight: 700; margin: 8px 0; }
    .price-note { font-size: 13px; color: #4ade80; }
    .details-box { background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-label { color: #64748b; font-weight: 600; }
    .detail-value { color: #0f172a; font-weight: 600; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; padding: 14px 32px; margin: 8px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
    .button-accept { background-color: #22c55e; color: #ffffff !important; }
    .button-accept:hover { background-color: #16a34a; }
    .button-decline { background-color: #ef4444; color: #ffffff !important; }
    .button-decline:hover { background-color: #dc2626; }
    .info-box { background: #eff6ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
    .muted { color: #94a3b8; font-size: 13px; }
    .footer { text-align: center; color: #94a3b8; font-size: 13px; padding-top: 24px; margin-top: 24px; border-top: 1px solid #e2e8f0; }
    @media (max-width: 600px) {
      .card { padding: 20px; }
      h1 { font-size: 20px; }
      .price-amount { font-size: 28px; }
      .button { display: block; margin: 12px 0; }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <div class="container">
          <div class="card">
            <div class="header">
              <a href="${frontendUrl}" class="logo">🌍 ${new URL(frontendUrl).hostname.replace('www.', '').toUpperCase()}</a>
            </div>

            <h1>Your Travel Quote is Ready! 🎉</h1>
            <p>Hi <strong>${lead.name}</strong>,</p>
            <p>Great news! We've prepared a customized travel quote for your upcoming adventure.</p>

            <div class="highlight">
              <strong>📅 Event:</strong> ${quote.event?.name || 'N/A'}<br>
              <strong>📍 Location:</strong> ${quote.event?.location || 'N/A'}<br>
              <strong>🗓️ Travel Date:</strong> ${formatDate(quote.eventDate)}<br>
              <strong>👥 Travelers:</strong> ${quote.numberOfTravellers} ${quote.numberOfTravellers > 1 ? 'people' : 'person'}
            </div>

            <div class="price-box">
              <div class="price-label">Total Quote</div>
              <div class="price-amount">${formatPrice(quote.finalPrice)}</div>
              <div class="price-note">Valid until ${formatDate(quote.validUntil)}</div>
            </div>

            <div class="details-box">
              <h3 style="margin-top: 0; color: #0f172a;">💰 Complete Price Breakdown</h3>
              
              <div class="detail-row">
                <span class="detail-label">Package Base Price (per person)</span>
                <span class="detail-value">${formatPrice(pricingDetails.pricePerPerson)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Number of Travelers</span>
                <span class="detail-value">× ${pricingDetails.numberOfTravellers}</span>
              </div>
              
              <div class="detail-row" style="background: #f0fdf4; margin: 8px -16px; padding: 8px 16px;">
                <span class="detail-label" style="font-weight: 700;">Subtotal (Base)</span>
                <span class="detail-value" style="font-weight: 700; font-size: 16px;">${formatPrice(pricingDetails.basePrice)}</span>
              </div>

              <div style="padding: 8px 0; margin: 8px 0; border-top: 1px dashed #cbd5e1;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Price Adjustments</p>
              </div>

              ${pricingDetails.adjustments.seasonal.amount !== 0 ? `
              <div class="detail-row">
                <div>
                  <span class="detail-label">Seasonal Adjustment</span>
                  <div style="font-size: 12px; color: #94a3b8;">${pricingDetails.adjustments.seasonal.reason}</div>
                </div>
                <div style="text-align: right;">
                  <span class="detail-value" style="color: ${pricingDetails.adjustments.seasonal.amount > 0 ? '#dc2626' : '#16a34a'};">
                    ${pricingDetails.adjustments.seasonal.amount > 0 ? '+' : ''}${formatPrice(pricingDetails.adjustments.seasonal.amount)}
                  </span>
                  <div style="font-size: 12px; color: ${pricingDetails.adjustments.seasonal.amount > 0 ? '#f87171' : '#4ade80'};">
                    (${pricingDetails.adjustments.seasonal.percentage > 0 ? '+' : ''}${pricingDetails.adjustments.seasonal.percentage}%)
                  </div>
                </div>
              </div>` : ''}
              
              ${pricingDetails.adjustments.earlyBird.amount !== 0 ? `
              <div class="detail-row">
                <div>
                  <span class="detail-label">Early Bird Discount</span>
                  <div style="font-size: 12px; color: #94a3b8;">${pricingDetails.adjustments.earlyBird.reason}</div>
                </div>
                <div style="text-align: right;">
                  <span class="detail-value" style="color: #16a34a;">
                    -${formatPrice(Math.abs(pricingDetails.adjustments.earlyBird.amount))}
                  </span>
                  <div style="font-size: 12px; color: #4ade80;">
                    (${pricingDetails.adjustments.earlyBird.percentage}%)
                  </div>
                </div>
              </div>` : ''}
              
              ${pricingDetails.adjustments.lastMinute.amount !== 0 ? `
              <div class="detail-row">
                <div>
                  <span class="detail-label">Last Minute Surcharge</span>
                  <div style="font-size: 12px; color: #94a3b8;">${pricingDetails.adjustments.lastMinute.reason}</div>
                </div>
                <div style="text-align: right;">
                  <span class="detail-value" style="color: #dc2626;">
                    +${formatPrice(pricingDetails.adjustments.lastMinute.amount)}
                  </span>
                  <div style="font-size: 12px; color: #f87171;">
                    (+${pricingDetails.adjustments.lastMinute.percentage}%)
                  </div>
                </div>
              </div>` : ''}
              
              ${pricingDetails.adjustments.group.amount !== 0 ? `
              <div class="detail-row">
                <div>
                  <span class="detail-label">Group Discount</span>
                  <div style="font-size: 12px; color: #94a3b8;">${pricingDetails.adjustments.group.reason}</div>
                </div>
                <div style="text-align: right;">
                  <span class="detail-value" style="color: #16a34a;">
                    -${formatPrice(Math.abs(pricingDetails.adjustments.group.amount))}
                  </span>
                  <div style="font-size: 12px; color: #4ade80;">
                    (${pricingDetails.adjustments.group.percentage}%)
                  </div>
                </div>
              </div>` : ''}
              
              ${pricingDetails.adjustments.weekend.amount !== 0 ? `
              <div class="detail-row">
                <div>
                  <span class="detail-label">Weekend Surcharge</span>
                  <div style="font-size: 12px; color: #94a3b8;">${pricingDetails.adjustments.weekend.reason}</div>
                </div>
                <div style="text-align: right;">
                  <span class="detail-value" style="color: #dc2626;">
                    +${formatPrice(pricingDetails.adjustments.weekend.amount)}
                  </span>
                  <div style="font-size: 12px; color: #f87171;">
                    (+${pricingDetails.adjustments.weekend.percentage}%)
                  </div>
                </div>
              </div>` : ''}

              ${pricingDetails.totalAdjustments === 0 ? `
              <div class="detail-row">
                <span style="color: #94a3b8; font-style: italic; font-size: 13px;">No adjustments applied</span>
              </div>` : ''}

              ${pricingDetails.totalAdjustments !== 0 ? `
              <div class="detail-row" style="background: #f0fdf4; margin: 8px -16px; padding: 8px 16px;">
                <span class="detail-label" style="font-weight: 700;">Total Adjustments</span>
                <span class="detail-value" style="font-weight: 700; font-size: 16px; color: ${pricingDetails.totalAdjustments > 0 ? '#dc2626' : '#16a34a'};">
                  ${pricingDetails.totalAdjustments > 0 ? '+' : ''}${formatPrice(Math.abs(pricingDetails.totalAdjustments))}
                </span>
              </div>` : ''}
              
              <div class="detail-row" style="border-bottom: none; padding-top: 16px; margin-top: 12px; border-top: 3px solid #0f172a; background: linear-gradient(to right, #f0fdf4, #dcfce7); margin: 16px -16px 0; padding: 16px;">
                <span class="detail-label" style="font-size: 18px; font-weight: 700;">Final Total Price</span>
                <span class="detail-value" style="font-size: 24px; font-weight: 700; color: #dc2626;">${formatPrice(pricingDetails.finalPrice)}</span>
              </div>
            </div>

            <div class="info-box">
              <strong>💡 What's included:</strong><br>
              ${quote.package?.inclusions?.join(', ') || 'Event tickets, accommodation, and more'}
            </div>

            <div class="button-container">
              <a href="${acceptUrl}" class="button button-accept">Accept Quote</a>
              <a href="${declineUrl}" class="button button-decline">Decline Quote</a>
            </div>

            <p class="muted">By accepting this quote, you agree to proceed with the booking. Our team will contact you with payment and further details.</p>
            
            <div style="height:1px;background:#eef2f7;margin:24px 0;border-radius:2px"></div>
            
            <p class="muted">Questions? Reply to this email or contact us at <a href="mailto:${process.env.EMAIL_FROM}" style="color:#0b74de;text-decoration:none">${process.env.EMAIL_FROM}</a></p>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${new URL(frontendUrl).hostname.replace('www.', '')}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Your Travel Quote is Ready!

Hi ${lead.name},

Event: ${quote.event?.name || 'N/A'}
Location: ${quote.event?.location || 'N/A'}
Travel Date: ${formatDate(quote.eventDate)}
Travelers: ${quote.numberOfTravellers}

Total Quote: ${formatPrice(quote.finalPrice)}
Valid Until: ${formatDate(quote.validUntil)}

To accept this quote, visit: ${acceptUrl}
To decline this quote, visit: ${declineUrl}

Questions? Reply to this email or contact us.

Best regards,
Your Travel Team
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };

  } catch (error) {
    console.error('Error sending quote email:', error);
    throw error;
  }
};
