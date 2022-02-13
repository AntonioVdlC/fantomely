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
  html: string;
  text: string;
};

export async function send({
  from = "fantomely <hi@fantomely.com>",
  to,
  subject,
  html,
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
    html,
    text,
  });
}

function baseTemplate({
  subject,
  preheader,
  body,
}: {
  subject: string;
  preheader: string;
  body: string;
}) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${subject}</title>
      <style>
        /* -------------------------------------
            GLOBAL RESETS
        ------------------------------------- */
        img {
          border: none;
          -ms-interpolation-mode: bicubic;
          max-width: 100%; }
        body {
          background-color: #f8fafc;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%; }
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%; }
          table td {
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top; }
        /* -------------------------------------
            BODY & CONTAINER
        ------------------------------------- */
        .body {
          background-color: #f8fafc;
          width: 100%; }
        /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
        .container {
          display: block;
          margin: 0 auto !important;
          /* makes it centered */
          max-width: 580px;
          padding: 10px;
          width: 580px; }
        /* This should also be a block element, so that it will fill 100% of the .container */
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 580px;
          padding: 10px; }
        /* -------------------------------------
            HEADER, FOOTER, MAIN
        ------------------------------------- */
        .main {
          background: #ffffff;
          border-radius: 3px;
          width: 100%; }
        .wrapper {
          box-sizing: border-box;
          padding: 20px; }
        .content-block {
          padding-bottom: 10px;
          padding-top: 10px;
        }
        .footer {
          clear: both;
          Margin-top: 10px;
          text-align: center;
          width: 100%; }
          .footer td,
          .footer p,
          .footer span,
          .footer a {
            color: #64748B;
            font-size: 12px;
            text-align: center; }
        /* -------------------------------------
            TYPOGRAPHY
        ------------------------------------- */
        h1,
        h2,
        h3,
        h4 {
          color: #0f172a;
          font-family: sans-serif;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
          margin-bottom: 30px; }
        h1 {
          font-size: 35px;
          font-weight: 300;
          text-align: center;
          text-transform: capitalize; }
        
        h2 {
          margin-top: 20px;
          margin-bottom: 10px;
          color: #334155;
        }
        p,
        ul,
        ol {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 15px; }
          p li,
          ul li,
          ol li {
            list-style-position: inside;
            margin-left: 5px; }
        a {
          color: #334155;
          text-decoration: underline; }
        
        strong {
          color: #334155;
          font-size: 1.17em;
          font-weight: bold; }

        .text-sm {
          font-size: 12px;
        }
        /* -------------------------------------
            BUTTONS
        ------------------------------------- */
        .btn {
          box-sizing: border-box;
          width: 100%; }
          .btn > tbody > tr > td {
            padding-bottom: 15px; }
          .btn table {
            width: auto; }
          .btn table td {
            background-color: #f8fafc;
            border-radius: 5px;
            text-align: center; }
          .btn a {
            background-color: #f8fafc;
            border: solid 1px #475569;
            border-radius: 5px;
            box-sizing: border-box;
            color: #475569;
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            padding: 12px 25px;
            text-decoration: none; }
        .btn-primary table td {
          background-color: #475569; }
        .btn-primary a {
          background-color: #475569;
          border-color: #475569;
          color: #f8fafc; }
        /* -------------------------------------
            OTHER STYLES THAT MIGHT BE USEFUL
        ------------------------------------- */
        .last {
          margin-bottom: 0; }
        .first {
          margin-top: 0; }
        .align-center {
          text-align: center; }
        .align-right {
          text-align: right; }
        .align-left {
          text-align: left; }
        .clear {
          clear: both; }
        .mt0 {
          margin-top: 0; }
        .mb0 {
          margin-bottom: 0; }
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0; }
        .powered-by a {
          text-decoration: none; }
        hr {
          border: 0;
          border-bottom: 1px solid #f1f5f9;
          Margin: 20px 0; }
        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
        @media only screen and (max-width: 620px) {
          table[class=body] h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important; }
          table[class=body] p,
          table[class=body] ul,
          table[class=body] ol,
          table[class=body] td,
          table[class=body] span,
          table[class=body] a {
            font-size: 16px !important; }
          table[class=body] .wrapper,
          table[class=body] .article {
            padding: 10px !important; }
          table[class=body] .content {
            padding: 0 !important; }
          table[class=body] .container {
            padding: 0 !important;
            width: 100% !important; }
          table[class=body] .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important; }
          table[class=body] .btn table {
            width: 100% !important; }
          table[class=body] .btn a {
            width: 100% !important; }
          table[class=body] .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important; }}
        /* -------------------------------------
            PRESERVE THESE STYLES IN THE HEAD
        ------------------------------------- */
        @media all {
          .ExternalClass {
            width: 100%; }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%; }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important; }
          .btn-primary table td:hover {
            background-color: #334155 !important; }
          .btn-primary a:hover {
            background-color: #334155 !important;
            border-color: #334155 !important; } }
      </style>
    </head>
    <body class="">
      <table border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">
              <!-- START CENTERED WHITE CONTAINER -->
              <span class="preheader">${preheader}</span>
              <table class="main">
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          ${body}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- START FOOTER -->
              <div class="footer">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-block">
                      <span class="apple-link">fantomely 👻<br>
                      Privacy-fist web analytics</span>
                      <br><br>
                      Need help? Please feel free to <a href="mailto:support@fantomely.com">reach out</a>!
                    </td>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
            <!-- END CENTERED WHITE CONTAINER -->
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export const templates = {
  welcomeBeta: ({ firstName, link }: { firstName: string; link: string }) =>
    baseTemplate({
      subject: "Welcome to fantomely!",
      preheader: "Welcome to fantomely! 👻 We're excited you are here!",
      body: `
    <p>Hello ${firstName}!</p>
    <p>Thanks for your interest in trying out fantomely, a privacy-first web analytics platform! 👻</p>
    <p>You have been invited to participate in our private beta. To complete your account and start exploring the platform, click on the following button:</p>
    <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        <tr>
          <td align="left">
            <table border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td> <a href="${link}" target="_blank" rel="noopener noreferrer">Join fantomely</a> </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <p>You can also click or copy the following link in your browser:</p>
    <p>${link}</p>`,
    }),

  login: ({ link }: { link: string }) =>
    baseTemplate({
      subject: "Login to fantomely",
      preheader: "Your magic link to login to fantomely is here!",
      body: `
    <p>Hello friend!</p>
    <p>Here is your magic link to log into your fantomely account:</p>
    <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        <tr>
          <td align="left">
            <table border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td> <a href="${link}" target="_blank" rel="noopener noreferrer">Login to fantomely</a> </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <p>You can also click or copy the following link in your browser:</p>
    <p>${link}</p>
  `,
    }),
};
