import { state } from "../../state";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

let current_location = { lng: null, lat: null };

export const getLocationBySearch = (mapContainer, buttonEl) => {
  const map = initMap(mapContainer);
  initSearch(map);

  buttonEl.addEventListener("click", (e) => {
    e.preventDefault();

    // $ Set Location lng and lat.
    const { pet } = state.getState();
    pet.last_location_lat = current_location.lng;
    pet.last_location_lng = current_location.lat;
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
  // # Set Marker options.
  let marker = new mapboxgl.Marker({
    color: "violet",
    draggable: true,
  });

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
