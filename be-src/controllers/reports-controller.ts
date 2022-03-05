import { Report } from "../models";
import { initSendgrid } from "../lib/sendgrid";

export const setReport = async (pet_data, owner_email): Promise<boolean> => {
  const { full_name, phone_number, message, pet_id, pet_name } = pet_data;

  Report.create({
    full_name,
    phone_number,
    message,
    reported_pet: pet_id,
  });

  return await initSendgrid(phone_number, message, full_name, owner_email, pet_name);
};
