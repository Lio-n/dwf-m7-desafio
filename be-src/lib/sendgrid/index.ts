const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const initSendgrid = async (phone_number, message, full_name, ownerEmail) => {
  const msg = {
    to: ownerEmail,
    from: "lookingformyfriend@outlook.com", // Use the email address or domain you verified above
    subject: "Nuevo avistamiento por parte de " + full_name,
    html: `<strong>${message} ${phone_number}</strong>`,
  };
  await sgMail.send(msg);
  return true;
};
