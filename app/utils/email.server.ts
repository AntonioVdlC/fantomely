import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);

if (
  typeof process.env.MG_API_KEY !== "string" ||
  typeof process.env.MG_DOMAIN !== "string"
) {
  throw new Error(
    "Error setting up email service. Please make sure the required environment variables are set up correctly."
  );
}

const client = mailgun.client({
  username: "api",
  key: process.env.MG_API_KEY,
  // url: "https://api.eu.mailgun.net",
});

type EmailSendData = {
  from?: string;
  to: string;
  subject: string;
  text: string;
};

export async function send({
  from = "fantomely <hi@fantomely.com>",
  to,
  subject,
  text,
}: EmailSendData) {
  if (typeof process.env.MG_DOMAIN !== "string") {
    throw new Error(
      "Error sending an email. Please make sure the required environment variables are set up correctly."
    );
  }

  return client.messages.create(process.env.MG_DOMAIN, {
    from,
    to,
    subject,
    text,
  });
}
