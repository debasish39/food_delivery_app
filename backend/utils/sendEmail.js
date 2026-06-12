import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error(
      "Email Error:",
      error
    );

    throw error;
  }
};

export default sendEmail;