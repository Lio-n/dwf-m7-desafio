const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const initSendgrid = async (phone_number, message, full_name, ownerEmail, pet_name) => {
  const msg = {
    to: ownerEmail,
    from: "lookingformyfriend@outlook.com",
    subject: `Nuevo avistamiento de tu mascota ${pet_name}`,
    html: `Hola! tenemos nueva infomación acerca de tu mascota <strong>${pet_name}</strong>
          <br>
          Por parte de: <strong>${full_name}</strong><br> 
          Dato de Contacto: <strong>${phone_number}</strong><br>
          Dónde lo vio: ${message}`,
  };
  await sgMail.send(msg);
  return true;
};
