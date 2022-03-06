import algoliasearch from "algoliasearch";

const client = algoliasearch("4KTHPQCCNZ", process.env.ALGOLIA_ADMIN_KEY);
const pets_index = client.initIndex("pets");

export const algoliaSet = (petId: any, lat: any, lng: any): void => {
  pets_index.saveObject({
    objectID: petId,
    _geoloc: { lat, lng },
  });
};

export const algoliaUpdate = (pet: object): void => {
  pets_index.partialUpdateObject(pet);
};

export const algoliaDelete = (petId: any): void => {
  pets_index.deleteObject(petId);
};

export const algoliaPetsNearby = async (lat, lng): Promise<string[]> => {
  const { hits } = await pets_index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 25000,
  });

  return hits.map((item) => {
    return item.objectID;
  });
};
