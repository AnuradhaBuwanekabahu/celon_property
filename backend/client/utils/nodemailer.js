// utils/mailer.js
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailAppPassword = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailUser,
        pass: emailAppPassword
    }
});

// Verify connection on startup (optional but useful for debugging)
transporter.verify((error, success) => {
    if (error) {
        console.error("Mailer connection failed:", error.message);
    } else {
        console.log("Mailer is ready to send emails");
    }
});

export const sendOtpEmail = async (email, otp) => {
    if (!emailUser || !emailAppPassword) {
        throw new Error("EMAIL_USER and EMAIL_APP_PASSWORD must be configured");
    }

    await transporter.sendMail({
        from: `"Ceylon Property" <${emailUser}>`,
        to: email,
        subject: "Your Ceylon Property verification code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #14213D;">Verify your email</h2>
                <p style="color: #555;">Use the code below to verify your Ceylon Property account. This code expires in 5 minutes.</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #14213D; text-align: center; margin: 24px 0;">
                    ${otp}
                </div>
                <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `
    });
};

export const sendPropertyInquiryEmail = async ({
  clientEmail,
  propertyTitle,
  userEmail,
  message
}) => {
  if (!emailUser || !emailAppPassword) {
    throw new Error(
      "EMAIL_USER and EMAIL_APP_PASSWORD must be configured"
    );
  }

  await transporter.sendMail({
    from: `"Ceylon Property" <${emailUser}>`,

    // CLIENT receives the message
    to: clientEmail,

    // Client can click Reply and reply to USER
    replyTo: userEmail,

    subject: `New Inquiry - ${propertyTitle}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 25px;
        border: 1px solid #E5E5E5;
        border-radius: 12px;
      ">

        <h2 style="color: #14213D;">
          New Property Inquiry
        </h2>

        <p>
          You have received a new message from a user
          interested in your property.
        </p>

        <h3 style="color: #14213D;">
          Property
        </h3>

        <p>
          <strong>${propertyTitle || "Property"}</strong>
        </p>

        <h3 style="color: #14213D;">
          Message
        </h3>

        <div style="
          background: #f7f7f7;
          padding: 16px;
          border-radius: 8px;
          line-height: 1.6;
        ">
          ${message}
        </div>

        <hr>

        <p>
          <strong>From User:</strong>
          ${userEmail}
        </p>

        <p style="color: #999; font-size: 13px;">
          Click Reply to respond directly to this user.
        </p>

      </div>
    `
  });
};

export default transporter;