// Email Template (Separation of Concerns - presentation logic)
class EmailTemplate {
    static generateConfirmationEmail(data) {
        const { fullName, lastName, gender, email, phoneNumber, CollegeName,
            address, branch, sem, enrollmentNo, programDisplay, event,
            teamName, razorpay_payment_id, razorpay_order_id, amountPaid } = data;

        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .section { margin-bottom: 25px; }
        .section-title { color: #667eea; font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { font-weight: bold; min-width: 150px; color: #555; }
        .info-value { color: #333; }
        .payment-success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none; }
        .footer p { margin: 5px 0; color: #666; font-size: 14px; }
        .highlight { background: #fff3cd; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Registration Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">${programDisplay}</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${fullName} ${lastName}</strong>,</p>
            
            <div class="payment-success">
                ✅ Payment Successful! Your registration has been confirmed.
            </div>
            
            <div class="section">
                <div class="section-title">👤 Personal Information</div>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${fullName} ${lastName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Gender:</span>
                    <span class="info-value">${gender}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${phoneNumber}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🎓 Academic Information</div>
                <div class="info-row">
                    <span class="info-label">College:</span>
                    <span class="info-value">${CollegeName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${address}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Branch:</span>
                    <span class="info-value">${branch}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Semester:</span>
                    <span class="info-value">${sem}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Enrollment No:</span>
                    <span class="info-value">${enrollmentNo}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🎯 Event Details</div>
                <div class="info-row">
                    <span class="info-label">Program:</span>
                    <span class="info-value"><span class="highlight">${programDisplay}</span></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Event:</span>
                    <span class="info-value"><strong>${event}</strong></span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">💳 Payment Information</div>
                <div class="info-row">
                    <span class="info-label">Transaction ID:</span>
                    <span class="info-value"><code>${razorpay_payment_id}</code></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Order ID:</span>
                    <span class="info-value"><code>${razorpay_order_id}</code></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Amount Paid:</span>
                    <span class="info-value"><strong style="color: #28a745; font-size: 18px;">₹${amountPaid}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value" style="color: #28a745; font-weight: bold;">✓ SUCCESS</span>
                </div>
            </div>
            
            <p style="margin-top: 30px; padding: 15px; background: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 4px;">
                <strong>Note:</strong> Please save this email for your records. You may need to show this confirmation at the event.
            </p>
            
            <p style="margin-top: 20px;">Thank you for participating! We look forward to seeing you at the event.</p>
        </div>
        
        <div class="footer">
            <p><strong>${teamName}</strong></p>
            <p>Government College of Engineering Dahod</p>
            <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    static generatePlainTextEmail(data) {
        const { fullName, lastName, programDisplay, razorpay_payment_id,
            razorpay_order_id, amountPaid, teamName } = data;

        return `Dear ${fullName} ${lastName},

Payment Successful! Your registration for ${programDisplay} has been confirmed.

Transaction ID: ${razorpay_payment_id}
Order ID: ${razorpay_order_id}
Amount Paid: ₹${amountPaid}

Thank you for participating!

Best Regards,
${teamName}`;
    }
}

module.exports = EmailTemplate;
