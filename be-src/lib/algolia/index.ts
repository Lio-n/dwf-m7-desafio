import algoliasearch from "algoliasearch";

const client = algoliasearch("4KTHPQCCNZ", process.env.ALGOLIA_ADMIN_KEY);
const pets_index = client.initIndex("pets");

export const algoliaSet = (petId: any, lat: any, lng: any): void => {
  pets_index.saveObject({
    objectID: petId,
    _geoloc: { lat, lng },
  });
};

export const algoliaUpdate = (pet): void => {
  pets_index.partialUpdateObject(pet);
};

export const algoliaDelete = (petId): void => {
  pets_index.deleteObject(petId);
};
