import { state } from "../../state";

// # This map it's used by the page reportar-mascota.

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

// # Set Marker options.
let marker = new mapboxgl.Marker({
  color: "violet",
  draggable: true,
});

let current_location = { lng: null, lat: null };
export const getLocationBySearch = (mapContainer, buttonEl) => {
  const map = initMap(mapContainer);
  initSearch(map);

  const { pet } = state.getState();
  if (!!pet.last_location_lat) {
    map.flyTo({ center: [pet.last_location_lng, pet.last_location_lat], zoom: 10 });
    marker.setLngLat([pet.last_location_lng, pet.last_location_lat]).addTo(map);
  }

  buttonEl.addEventListener("click", (e) => {
    e.preventDefault();
    const { lng, lat } = marker.getLngLat();

    // $ Set Location lng and lat.
    const { pet } = state.getState();
    pet.last_location_lat = current_location.lat || lat;
    pet.last_location_lng = current_location.lng || lng;
  });
};

const initMap = (mapContainer) => {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  return new mapboxgl.Map({
    container: mapContainer,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [0, 0],
    zoom: 2,
  });
};

const initSearch = (map) => {
  // # Searcher.
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: false,
    mapboxgl,
  });

  map.addControl(geocoder);

  geocoder.on("result", (e) => {
    geocoder.clear();
    let [lng, lat] = e.result.center;

    current_location = { lng, lat };

    // # Add Marker.
    marker.setLngLat(e.result.center).addTo(map);

    // # Dragend.
    marker.on("dragend", (e) => {
      let lngLat = e.target.getLngLat();

      current_location = { lng: lngLat.lng, lat: lngLat.lat };
    });
  });
};
