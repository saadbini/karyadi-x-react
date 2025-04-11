import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const SITE_URL = process.env.SITE_URL || "https://www.karyaditalents.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendRSVPConfirmationEmail = (
  userEmail,
  eventId,
  eventName,
  eventDate,
  eventTimeWithTimezone
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `RSVP Confirmation for ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h1 style="color: #333; text-align: center;">Thank you for RSVPing!</h1>
        <p style="color: #555; font-size: 16px;">You have successfully RSVPed to the event <strong style="color: #000;">${eventName}</strong>.</p>
        <p style="color: #555; font-size: 16px;"><strong>Date:</strong> ${eventDate}</p>
        <p style="color: #555; font-size: 16px;"><strong>Time:</strong> ${eventTimeWithTimezone}</p>
        <p style="color: #555; font-size: 16px;">We look forward to seeing you at the event!</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${SITE_URL}/events/${eventId}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">View Event Details</a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #007bff;">support@example.com</a>.</p>
      </div>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const sendRSVPCancelEmail = (userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Your RSVP Has Been Canceled`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h1 style="color: #333; text-align: center;">Your RSVP Has Been Canceled</h1>
        <p style="color: #555; font-size: 16px;">You've successfully canceled your RSVP for this event. Your spot is now open for someone else.</p>
        <p style="color: #555; font-size: 16px;">Changed your mind? You can RSVP again while slots are available!</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${SITE_URL}/events" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">View Event</a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #007bff;">support@example.com</a>.</p>
      </div>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const sendPasswordResetEmail = (userEmail, tempPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
        <p style="color: #555; font-size: 16px;">You have requested to reset your password. Here is your temporary password:</p>
        <p style="color: #555; font-size: 16px; font-weight: bold;">${tempPassword}</p>
        <p style="color: #555; font-size: 16px;">Please use this temporary password to log in and change your password immediately.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${SITE_URL}/login" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Log In</a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">If you did not request a password reset, please ignore this email or contact support.</p>
      </div>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
