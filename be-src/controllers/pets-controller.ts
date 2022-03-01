// # Models
import { algoliaSet, algoliaUpdate, algoliaDelete } from "../lib/algolia";
import { Pet } from "../models";

export const getAllPets = async (): Promise<object> => {
  const pets = await Pet.findAll({ where: { state: "lost" } });
  return pets;
};

export const publishPet = async (pet_data: object, userId: number): Promise<boolean> => {
  const pet = await Pet.create({ ...pet_data, state: "lost", published_by: userId });

  algoliaSet(pet.get("id"), pet.get("last_location_lat"), pet.get("last_location_lat"));

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

  algoliaUpdate({
    objectID: petId,
    _geoloc: { lat: pet.last_location_lat, lng: pet.last_location_lng },
  });

  return true;
};

export const deletePet = async (userId: number, petId: number): Promise<boolean> => {
  await Pet.destroy({ where: { published_by: userId, id: petId } });
  algoliaDelete(petId);
  return true;
};
