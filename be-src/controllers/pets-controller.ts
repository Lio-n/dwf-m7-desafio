// # Models
import { Pet } from "../models";

export const getAllPets = async (): Promise<object> => {
  const pets = await Pet.findAll({ where: { state: "lost" } });
  return pets;
};

export const publishPet = async (petData: object, userId: number): Promise<boolean> => {
  const pet = await Pet.create({ ...petData, state: "lost", published_by: userId });
  return pet ? true : false;
};

export const getUserPets = async (userId: number): Promise<object> => {
  const userPets = await Pet.findAll({
    attributes: ["full_name", "pictureUrl", "id"],
    where: { published_by: userId },
  });

  return userPets;
};

export const getOnePet = async (userId: number, petId: number): Promise<object> => {
  const onePet = await Pet.findOne({
    where: { published_by: userId, id: petId },
  });

  return onePet;
};

export const updatePet = async (userId: number, petId: number, pet): Promise<boolean> => {
  await Pet.findOne({
    where: { published_by: userId, id: petId },
  }).then((petRes) => {
    petRes.update(pet);
  });

  return true;
};

export const deletePet = async (userId: number, petId: number): Promise<boolean> => {
  await Pet.destroy({ where: { published_by: userId, id: petId } });
  return true;
};
