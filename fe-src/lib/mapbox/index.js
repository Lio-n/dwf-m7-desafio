import { state } from "../../state";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export const getCurrentPosition = () => {
  // Get the Coordinates
  navigator.geolocation.getCurrentPosition((geo) => {
    const { longitude, latitude } = geo.coords;

    state.setState({ ...state.getState(), currentPosition: { lng: longitude, lat: latitude } });
  });
};

export const setPetsOnMap = async (mapContainer) => {
  // * Must run at least once
  const map = initMap(mapContainer);
  const currentMarkers = await showAllPets(map);

  state.subscribe(() => {
    const { lng, lat } = state.getState().currentPosition;

    if (lat != undefined) {
      map.flyTo({ center: [lng, lat] });
      currentMarkers.forEach((marker) => marker.remove());

      showPetsNearby(map, lng, lat);
    }
  });
};

const initMap = (mapContainer) => {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  return new mapboxgl.Map({
    container: mapContainer,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-4.486109177517903, 48.399989097932604],
    zoom: 10,
  });
};

const showAllPets = async (map) => {
  const arrPets = await state.getAllPets();
  let mapMarkers = [];

  // Add markers to the map.
  for (const pet of arrPets) {
    // Create a DOM element for each marker.
    const el = document.createElement("div");
    el.innerHTML = `<div class="picture__pet marker" style="background-image: url(${pet.pictureUrl});"></div>`;

    const date = new Date(pet.date_last_seen).toISOString().substring(0, 10);

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div class="card__picture">
        <div class="picture__layer">
            <p><span>Nombre: </span> ${pet.full_name}</p>
            <p><span>Raza: </span>${pet.breed}</p>
            <p><span>Visto por última vez: </span> ${date}</p>
        </div>
        <img src="${pet.pictureUrl}"/>
    </div>`);

    // Add markers to the map.
    const marker = new mapboxgl.Marker(el)
      .setLngLat([pet.last_location_lat, pet.last_location_lng])
      .setPopup(popup)
      .addTo(map);

    mapMarkers.push(marker);
  }

  return mapMarkers;
};

const showPetsNearby = async (map, lat, lng) => {
  const arrPetsNearby = await state.getPetsNearby(lat, lng);

  // Add markers to the map.
  for (const pet of arrPetsNearby) {
    // Create a DOM element for each marker.
    const el = document.createElement("div");
    el.innerHTML = `<div class="picture__pet marker" style="background-image: url(${pet.pictureUrl});"></div>`;

    const date = new Date(pet.date_last_seen).toISOString().substring(0, 10);

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div class="card__info">
        <div class="card__picture">
            <div class="picture__layer">
                <p><span>Nombre: </span> ${pet.full_name}</p>
                <p><span>Raza: </span>${pet.breed}</p>
                <p><span>Visto por última vez: </span> ${date}</p>
            </div>
            <img src="${pet.pictureUrl}"/>
        </div>

        <div class="report">
            <a class="pet__report">Reportar</a>
        </div>
    </div>

    <my-report color="${pet.color}" breed="${pet.breed}" sex="${pet.sex}" full_name="${pet.full_name}" published_by="${pet.published_by}" pet_id="${pet.id}" pet_pictureUrl="${pet.pictureUrl}"></my-report>`);

    // Add markers to the map.
    new mapboxgl.Marker(el)
      .setLngLat([pet.last_location_lat, pet.last_location_lng])
      .setPopup(popup)
      .addTo(map);

    const _listeners = () => {
      const card__info = popup._content.children[0];
      const myReport = popup._content.children[1];
      const button_report = card__info.children[1];

      button_report.addEventListener("click", (e) => {
        e.preventDefault();
        card__info.style.display = "none";
        myReport.style.display = "block";
      });

      el.addEventListener("click", (e) => {
        e.preventDefault();
        card__info.style.display = "initial";
        myReport.style.display = "none";
      });
    };

    _listeners();
  }

  return arrPetsNearby;
};
