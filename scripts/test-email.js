require('dotenv').config();
const nodemailer = require('nodemailer');

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Sample test data
const testData = {
    fullName: 'Pavan',
    lastName: 'Kumar',
    gender: 'male',
    email: 'test@example.com', // CHANGE THIS TO YOUR EMAIL FOR TESTING
    phoneNumber: '1234567890',
    CollegeName: 'Government College of Engineering Dahod',
    address: 'Test Address, Gujarat',
    branch: 'Computer',
    sem: '5th',
    enrollmentNo: 'TEST123456',
    programType: 'techfest',
    programDisplay: 'TechFest 2k26',
    event: 'Hack-Accelerate',
    teamName: 'TechFest Team',
    razorpay_payment_id: 'pay_TEST123456789',
    razorpay_order_id: 'order_TEST987654321',
    amountPaid: 10
};

const { fullName, lastName, gender, email, phoneNumber, CollegeName,
    address, branch, sem, enrollmentNo, programDisplay, event,
    teamName, razorpay_payment_id, razorpay_order_id, amountPaid } = testData;

// HTML Email Template (same as in server.js)
const htmlEmail = `
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

async function sendTestEmail() {
    console.log('📧 Sending test acknowledgment email...\n');
    console.log('Email Configuration:');
    console.log(`  From: ${process.env.EMAIL_USER}`);
    console.log(`  To: ${email}`);
    console.log(`  Subject: ✅ Registration Confirmed - ${programDisplay}`);
    console.log('\n⚠️  NOTE: Change the "email" field in this script to your actual email address to receive the test!\n');

    const mailOptions = {
        from: `"${teamName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✅ Registration Confirmed - ${programDisplay} [TEST]`,
        html: htmlEmail,
        text: `Dear ${fullName} ${lastName},\n\nPayment Successful! Your registration for ${programDisplay} has been confirmed.\n\nTransaction ID: ${razorpay_payment_id}\nOrder ID: ${razorpay_order_id}\nAmount Paid: ₹${amountPaid}\n\nThank you for participating!\n\nBest Regards,\n${teamName}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}`);
        console.log('\n📬 Check your email inbox (and spam folder) for the test email!');
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('\nTroubleshooting:');
        console.error('  1. Check that EMAIL_USER and EMAIL_PASS are set in .env');
        console.error('  2. Make sure you are using an App Password (not your Gmail password)');
        console.error('  3. Enable "Less secure app access" or use App Passwords in Gmail settings');
    }
}

sendTestEmail();
