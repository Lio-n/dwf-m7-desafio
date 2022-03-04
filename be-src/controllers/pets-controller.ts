// # Models
import { algoliaSet, algoliaUpdate, algoliaDelete, algoliaPetsNearby } from "../lib/algolia";
import { Pet } from "../models";

export const getAllPets = async (): Promise<object> => {
  return await Pet.findAll({ where: { state: "lost" } });
};

export const publishPet = async (pet_data: object, userId: number): Promise<boolean> => {
  const pet = await Pet.create({ ...pet_data, state: "lost", published_by: userId });

  const [pet_id, pet_lat, pet_lng] = [
    pet.get("id"),
    pet.get("last_location_lat"),
    pet.get("last_location_lng"),
  ];

  // $ Algolia
  algoliaSet(pet_id, pet_lat, pet_lng);

  return pet ? true : false;
};

export const getUserPets = async (userId: number): Promise<object> => {
  return await Pet.findAll({
    attributes: ["full_name", "pictureUrl", "id"],
    where: { published_by: userId },
  });
};

export const getOnePet = async (userId: number, petId: number): Promise<object> => {
  return await Pet.findOne({
    where: { published_by: userId, id: petId },
  });
};

export const updatePet = async (userId: number, petId: number, pet): Promise<boolean> => {
  await Pet.findOne({
    where: { published_by: userId, id: petId },
  }).then((petRes) => {
    petRes.update(pet);
  });

  // $ Algolia
  algoliaUpdate({
    objectID: petId,
    _geoloc: { lat: pet.last_location_lat, lng: pet.last_location_lng },
  });

  return true;
};

export const deletePet = async (userId: number, petId: number): Promise<boolean> => {
  await Pet.destroy({ where: { published_by: userId, id: petId } });

  // $ Algolia
  algoliaDelete(petId);
  return true;
};

export const getPetsNearby = async (lat, lng) => {
  // $ Algolia
  const ids = await algoliaPetsNearby(lat, lng);
  return await Pet.findAll({
    where: {
      id: ids,
      state: "lost",
    },
  });
};
