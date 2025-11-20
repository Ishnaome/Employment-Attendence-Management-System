
const brevo = require('@getbrevo/brevo');
let apiInstance = new brevo.TransactionalEmailsApi();


function formatDate(dateString: any) {
    // Convert the string to a Date object
    const date = new Date(dateString);
  
    // Array of month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    // Extract parts of the date
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    // Construct the formatted date
    return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
  }

// Function to send verification email
export async function sendOTP( email: string, name: string, otp: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Account Verification OTP";
  sendSmtpEmail.htmlContent = `
<html>
<head>
 
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .logo {
            width: 40vw;
            height: 40vh;
        }
        .content {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        }
        .order-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            text-size: 25px;
            font-bold: bold;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background: #d4af37;
            color: white;
        }
        .button {
            display: inline-block;
            background: silver;
            color: white;
            padding: 4px 15px;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Header with Logo -->

    <!-- Email Content -->
    <div class="content">
        <p>Dear ${name},</p>

        <p>Here are OTP to get verified at <strong>${formatDate(new Date())}</strong>.</p>
        
        <div class="order-details">
            <p><strong>OTP :</strong> ${otp}</p>
        </div>

        <p>---</p>
        <p>Regards,</p>
        <p><strong>Attendance - Your health is safe with Us</strong></p>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><a href="https://doctorap.com">Visit our website</a> | <a href="mailto:codereveur@gmail.com">Get support</a></p>
        <p>${new Date().getFullYear()} Copyright © Attendance, All rights reserved.</p>
    </div>
</div>

</body>
</html>`;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email, "name": name }
];
sendSmtpEmail.replyTo = { "email": "hacketrich@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}
// Function to send verification email
export async function sendCredentials( email: string, name: string, username: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Your Forgotten Login Credentials";
  sendSmtpEmail.htmlContent = `
<html>
<head>
 
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .logo {
            width: 40vw;
            height: 40vh;
        }
        .content {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        }
        .order-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            text-size: 25px;
            font-bold: bold;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background: #d4af37;
            color: white;
        }
        .button {
            display: inline-block;
            background: silver;
            color: white;
            padding: 4px 15px;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Header with Logo -->

    <!-- Email Content -->
    <div class="content">
        <p>Dear ${name},</p>

        <p>Here are your login credentials</p>
        
        <div class="order-details">
            <p><strong>Full name :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Username :</strong> ${username}</p>
            <p>Done at: <strong>${formatDate(new Date())}</strong>. </p>
        </div>
        <p>Please don't share this senstive information, keep it safe</p>
        <p>---</p>
        <p>Regards,</p>
        <p><strong>RailTrack - Modernize the rail with smart technology</strong></p>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><a href="https://railtrack.com">Visit our website</a> | <a href="mailto:codereveur@gmail.com">Get support</a></p>
        <p>${new Date().getFullYear()} Copyright © RailTrack, All rights reserved.</p>
    </div>
</div>

</body>
</html>`;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email, "name": name }
];
sendSmtpEmail.replyTo = { "email": "hacketrich@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}

// Function to send verification email
export async function adminDoctorNotificationEmail(
  fullName: string,
  email: string,
  phone: string,
  specialization: string,
  clinicAddress: string,
  message: string,
): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "New Doctor Application Submitted";
  sendSmtpEmail.htmlContent = `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; font-size: 22px; color: #e74c3c; margin-bottom: 20px; }
      .table { width: 100%; border-collapse: collapse; }
      .table th, .table td { padding: 10px; text-align: left; border: 1px solid #ddd; }
      .table th { background: #3498db; color: white; }
      .footer { text-align: center; font-size: 12px; color: #888; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">New Doctor Application Submitted</div>
      <table class="table">
        <tr><th>Full Name</th><td>${fullName}</td></tr>
        <tr><th>Email</th><td>${email}</td></tr>
        <tr><th>Phone</th><td>${phone}</td></tr>
        <tr><th>Specialization</th><td>${specialization}</td></tr>
        <tr><th>Clinic Address</th><td>${clinicAddress}</td></tr>
        <tr><th>Message</th><td>${message || 'N/A'}</td></tr>
        <tr><th>Submitted At</th><td>${formatDate(new Date())}</td></tr>
      </table>
      <div class="footer">
        Admin Portal - DoctorApp © ${new Date().getFullYear()}
      </div>
    </div>
  </body>
  </html>
  `;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": "btrjoseph77@gmail.com", "name": "System Admin" }
];
sendSmtpEmail.replyTo = { "email": "btrjoseph77@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}

// Function to send verification email
export async function doctorConfirmationEmail(name: string, email: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Welcome to Our Doctor Network";
  sendSmtpEmail.htmlContent = ` <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; font-size: 24px; color: #2c3e50; margin-bottom: 10px; }
      .content { font-size: 16px; color: #333; line-height: 1.6; }
      .footer { text-align: center; font-size: 12px; color: #888; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to Our Doctor Network</div>
      <div class="content">
        <p>Dear Dr. ${name},</p>
        <p>Thank you for submitting your details to join our platform. Our admin team will review your profile and reach out to you shortly.</p>
        <p>We are excited to have you in our community and look forward to your valuable contributions.</p>
        <p><strong>Appointment requests will begin after approval.</strong></p>
        <p>Regards,<br/>Attendance Platform Team</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} DoctorApp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email , "name": name }
];
sendSmtpEmail.replyTo = { "email": "btrjoseph77@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}
// Function to send verification email
export async function appointmentNotificationToDoctor(name: string, email: string, dateTime: string,  problem: string, notes: string, patient: {
  name: string,
  email: string,
  phoneNumber?: string,
}): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "New Appointment Request";
  sendSmtpEmail.htmlContent = `<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; font-size: 20px; color: #34495e; margin-bottom: 20px; }
      .table { width: 100%; border-collapse: collapse; }
      .table th, .table td { padding: 10px; text-align: left; border: 1px solid #ddd; }
      .table th { background: #3498db; color: white; }
      .footer { text-align: center; font-size: 12px; color: #888; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">New Appointment Request</div>
      <p>Dear Dr. ${name},</p>
      <p>You have received a new appointment request. Below are the details:</p>
      <table class="table">
        <tr><th>Patient Name</th><td>${patient.name}</td></tr>
        <tr><th>Email</th><td>${patient.email}</td></tr>
        <tr><th>Phone</th><td>${patient.phoneNumber || 'N/A'}</td></tr>
        <tr><th>Problem</th><td>${problem}</td></tr>
        <tr><th>Preferred Date</th><td>${formatDate(dateTime)}</td></tr>
        <tr><th>Additional Notes</th><td>${notes || 'None'}</td></tr>
      </table>
      <p>Please log in to your dashboard to accept or reschedule this appointment.</p>
      <div class="footer">
        DoctorApp Admin | © ${new Date().getFullYear()}
      </div>
    </div>
  </body>
  </html>
  `;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email , "name": name }
];
sendSmtpEmail.replyTo = { "email": "btrjoseph77@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}

// Function to send verification email
export async function appointmentConfirmationToUser(name: string, doctorName: string, email: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Appointment Request Submitted";
  sendSmtpEmail.htmlContent = `<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; font-size: 24px; color: #2c3e50; margin-bottom: 20px; }
      .content { font-size: 16px; color: #333; line-height: 1.6; }
      .footer { text-align: center; font-size: 12px; color: #888; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Appointment Request Submitted</div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Your appointment request with <strong>Dr. ${doctorName}</strong> on <strong>${formatDate(new Date())}</strong> has been received.</p>
        <p>The doctor will confirm your appointment soon. You will be notified via email upon approval or if any changes are needed.</p>
        <p>Thank you for using our platform!</p>
        <p>Best regards,<br/>Attendance Team</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} DoctorApp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email , "name": name }
];
sendSmtpEmail.replyTo = { "email": "btrjoseph77@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}

// Function to send verification email
export async function appointmentApprovalToPatient(name: string, email: string, doctorName: string, location: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "🎉 Appointment Approved!";
  sendSmtpEmail.htmlContent = `<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        font-size: 22px;
        color: #2c3e50;
        margin-bottom: 20px;
        font-weight: bold;
      }
      .content {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .details {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 15px;
        margin-top: 20px;
        border-radius: 8px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888888;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">🎉 Appointment Approved!</div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been <strong>approved</strong>.</p>
        <div class="details">
          <p><strong>Date & Time:</strong> ${formatDate(new Date())}</p>
          <p><strong>Location:</strong> ${location}</p>
        </div>
        <p>Please ensure to arrive at least 10 minutes before your appointment time. If you need to reschedule or cancel, kindly contact us in advance.</p>
        <p>We look forward to helping you feel better!</p>
        <p>Warm regards,<br/>Attendance Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} DoctorApp — All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email , "name": name }
];
sendSmtpEmail.replyTo = { "email": "btrjoseph77@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}

// Function to send verification email
export async function appointmentRescheduledToPatient(
  name: string,
  email: string,
  doctorName: string,
  oldDateTime: string,
  newDateTime: string,
  location: string,
  reason?: string
): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "📅 Your Appointment Has Been Rescheduled";
  sendSmtpEmail.htmlContent = ` <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        font-size: 22px;
        color: #d35400;
        margin-bottom: 20px;
        font-weight: bold;
      }
      .content {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .details {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 15px;
        margin-top: 20px;
        border-radius: 8px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888888;
        margin-top: 30px;
      }
      .highlight {
        font-weight: bold;
        color: #2c3e50;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">📅 Your Appointment Has Been Rescheduled</div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been <span class="highlight">rescheduled</span>.</p>
        ${
          reason
            ? `<p><strong>Reason:</strong> ${reason}</p>`
            : ''
        }
        <div class="details">
          <p><strong>Previous Date & Time:</strong> ${formatDate(oldDateTime)}</p>
          <p><strong>New Date & Time:</strong> ${formatDate(newDateTime)}</p>
          <p><strong>Location:</strong> ${location}</p>
        </div>
        <p>We apologize for any inconvenience. If the new time does not work for you, please reach out to us to reschedule again.</p>
        <p>Best regards,<br/>Attendance Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} DoctorApp — All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email , "name": name }
];
sendSmtpEmail.replyTo = { "email": "btrjoseph77@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}
// Function to send verification email
export async function appointmentCancledToPatient(
  name: string,
  email: string,
  date: string,
  reason?: string
): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "❌ Your Appointment Has Been Cancelled";
  sendSmtpEmail.htmlContent = ` <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        font-size: 22px;
        color: #d35400;
        margin-bottom: 20px;
        font-weight: bold;
      }
      .content {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .details {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 15px;
        margin-top: 20px;
        border-radius: 8px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888888;
        margin-top: 30px;
      }
      .highlight {
        font-weight: bold;
        color: #2c3e50;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Your Appointment Has Been Cancelled</div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Your appointment wich was scheduled at ${formatDate(date)}  has been <span class="highlight">Cancelled</span>.</p>
        ${
          reason
            ? `<p><strong>Reason:</strong> ${reason}</p>`
            : ''
        }
        
        <p>We apologize for any inconvenience. If does not work for you, please reach out to us to reschedule again.</p>
        <p>Best regards,<br/>Attendance Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} DoctorApp — All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
sendSmtpEmail.sender = { "name": "Attendance ", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email , "name": name }
];
sendSmtpEmail.replyTo = { "email": "btrjoseph77@gmail.com", "name": "Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Email sent!. ');
}, function (error: any) {
  console.error(error);
});

}
