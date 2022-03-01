import { state } from "../../state";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export const getCurrentPosition = () => {
  // Get the Coordinates
  navigator.geolocation.getCurrentPosition((geo) => {
    const { longitude, latitude } = geo.coords;

    state.setState({ ...state.getState(), currentPosition: { lng: longitude, lat: latitude } });
  });
};

export const setPetsOnMap = (mapContainer) => {
  // * Must run at least once
  const map = initMap(mapContainer);
  showAllPets(map);

  state.subscribe(() => {
    const { lng, lat } = state.getState().currentPosition;

    const map = initMap(mapContainer, lng, lat);

    if (lat != undefined) {
      showPetsNearby(map, lat, lng);
    }

    showAllPets(map);
  });
};

const initMap = (mapContainer, lng, lat) => {
  console.log("initMAP");
  mapboxgl.accessToken = MAPBOX_TOKEN;
  return new mapboxgl.Map({
    container: mapContainer,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [lng || -4.486109177517903, lat || 48.399989097932604],
    zoom: 10,
  });
};

const showAllPets = async (map) => {
  const arrPets = await state.getAllPets();
  console.log({ arrPets });
  // Add markers to the map.
  for (const pet of arrPets) {
    // Create a DOM element for each marker.
    const el = document.createElement("div");
    el.innerHTML = `<div class="picture__pet marker" style="background-image: url(${pet.pictureUrl});"></div>`;

    const date = new Date(pet.date_last_seen).toISOString().substring(0, 10);

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="card__info">
          <p><span>Nombre:</span> ${pet.full_name}</p>
          <p><span>Visto por última vez:</span> ${date}</p>
      </div>`);

    // Add markers to the map.
    new mapboxgl.Marker(el)
      .setLngLat([pet.last_location_lat, pet.last_location_lng])
      .setPopup(popup)
      .addTo(map);
  }
};

const showPetsNearby = async (map, lat, lng) => {
  const arrPetsNearby = await state.getPetsNearby(lat, lng);

  console.log({ arrPetsNearby });
  // Add markers to the map.
  for (const pet of arrPetsNearby) {
    // Create a DOM element for each marker.
    const el = document.createElement("div");
    el.innerHTML = `<div class="picture__pet marker" style="background-image: url(${pet.pictureUrl});"></div>`;

    const date = new Date(pet.date_last_seen).toISOString().substring(0, 10);

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="card__info">
          <p><span>Nombre:</span> ${pet.full_name}</p>
          <p><span>Visto por última vez:</span> ${date}</p>
          <a class="pet__report">Reportar</a>
      </div>

    <my-report color="${pet.color}" breed="${pet.breed}" sex="${pet.sex}" full_name="${pet.full_name}" published_by="${pet.published_by}" pet_id="${pet.id}" pet_pictureUrl="${pet.pictureUrl}"></my-report>`);

    // Add markers to the map.
    new mapboxgl.Marker(el)
      .setLngLat([pet.last_location_lat, pet.last_location_lng])
      .setPopup(popup)
      .addTo(map);

    const _listeners = () => {
      const card__info = popup._content.children[0];
      const pet__report = card__info.children[2];
      const myReport = popup._content.children[1];

      pet__report.addEventListener("click", (e) => {
        e.preventDefault();
        card__info.style.display = "none";
        myReport.style.display = "initial";
      });

      el.addEventListener("click", (e) => {
        e.preventDefault();
        card__info.style.display = "initial";
        myReport.style.display = "none";
      });
    };

    _listeners();
  }
};
