import { state } from "../../state";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export const setPetsOnMap = (mapContainer) => {
  // * Must run at least once
  const map = initMap(mapContainer);
  showPets(map);

  state.subscribe(() => {
    const map = initMap(mapContainer);
    showPets(map);
  });
};

const initMap = (mapContainer) => {
  const { lng, lat } = state.getState().currentPosition;

  mapboxgl.accessToken = MAPBOX_TOKEN;
  return new mapboxgl.Map({
    container: mapContainer,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [lng || -4.486109177517903, lat || 48.399989097932604],
    zoom: 10,
  });
};

export const getCurrentPosition = () => {
  // Get the Coordinates
  navigator.geolocation.getCurrentPosition((geo) => {
    const { longitude, latitude } = geo.coords;

    state.setState({ ...state.getState(), currentPosition: { lng: longitude, lat: latitude } });
  });
};

const showPets = async (map) => {
  const arrPets = await state.getAllPets();
  console.log({ arrPets });
  // Add markers to the map.
  for (const marker of arrPets) {
    // Create a DOM element for each marker.
    const el = document.createElement("div");
    el.innerHTML = `<div class="picture__pet marker" style="background-image: url(${marker.pictureUrl});"></div>`;

    const date = new Date(marker.date_last_seen).toISOString().substring(0, 10);
    el.addEventListener("click", (e) => {
      e.preventDefault();
      let obj = { full_name: marker.full_name, id: marker.id };
      console.log(obj);
      return obj;
    });

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <p><span>Nombre:</span> ${marker.full_name}</p>
    <p><span>Raza:</span> ${marker.breed}</p>
    <p><span>Color:</span> ${marker.color}</p>
    <p><span>Visto por última vez:</span> ${date}</p>`);

    // Add markers to the map.
    new mapboxgl.Marker(el)
      .setLngLat([marker.last_location_lat, marker.last_location_lng])
      .setPopup(popup)
      .addTo(map);
  }
};
