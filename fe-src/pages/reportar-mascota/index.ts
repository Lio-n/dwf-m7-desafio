import { getLocationBySearch } from "../../lib/mapbox/mapbox-geocoding";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Report extends HTMLElement {
  shadow: ShadowRoot;
  errorInput: string = "1px solid red";
  niceInput: string = "1px solid lightgrey";
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  async connectedCallback() {
    const pet_default = {
      full_name: undefined,
      pictureUrl: undefined,
      breed: undefined,
      color: undefined,
      sex: undefined,
      date_last_seen: undefined,
      last_location_lat: undefined,
      last_location_lng: undefined,
    };

    state.setState({ ...state.getState(), pet: pet_default });
    this.render();
    this.addListener();
  }
  addListener() {
    const cancelReport = () => {
      const btnCancel: HTMLButtonElement = this.shadow.querySelector(".button__cancel-report");

      btnCancel.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/mis-mascotas");
      });
    };
    cancelReport();

    const btnReport: HTMLButtonElement = this.shadow.querySelector(".button__confirm-report");
    const radiusInput: NodeListOf<HTMLInputElement> = this.shadow.querySelectorAll("input");

    const mapContainer: HTMLElement = this.shadow.getElementById("map");
    getLocationBySearch(mapContainer, btnReport);

    let pet_layer = {
      full_name: undefined,
      breed: undefined,
      color: undefined,
      sex: undefined,
      date_last_seen: undefined,
    };

    const checkInputs = () => {
      const inputsArr: NodeListOf<Element> = this.shadow.querySelectorAll("my-input");

      // # Check if the value of each 'my-input' has been completed.
      let arr: Array<boolean> = [];

      btnReport.addEventListener("click", (e) => {
        e.preventDefault();

        inputsArr.forEach((item) => {
          let inputValue: string = item.shadowRoot.querySelector("input").value;
          let inputName: string = item.getAttribute("name");

          if (!inputValue) {
            arr.push(false);
            item.setAttribute("border-color", this.errorInput);
          } else {
            // # Set the value of each key.
            pet_layer[inputName] = inputValue;
            arr.push(true);
            item.setAttribute("border-color", this.niceInput);
          }
        });

        validateInputs(arr);

        arr = [];
      });
    };

    const validateInputs = async (arr) => {
      const mapboxAlert: HTMLElement = this.shadow.querySelector(".mapbox__alert");
      const dropzoneAlert: HTMLElement = this.shadow.querySelector(".dropzone__alert");

      const { pet } = state.getState();

      !!pet.last_location_lat
        ? (mapboxAlert.style.display = "none")
        : (mapboxAlert.style.display = "initial");

      !!pet.pictureUrl
        ? (dropzoneAlert.style.display = "none")
        : (dropzoneAlert.style.display = "initial");

      if (!arr.includes(false) && !!pet.last_location_lat) {
        radiusInput.forEach((item) => {
          const { value, checked } = item;
          if (checked) pet_layer.sex = value;
        });

        // # Set the values of 'pet_layer' to 'pet'.
        Object.keys(pet).forEach(function (key) {
          if (pet[key] == undefined) {
            pet[key] = pet_layer[key];
          }
        });

        await state.publishPet(pet);

        Router.go("/mis-mascotas");
      }
    };

    checkInputs();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    .form {
      margin: 0 auto;
      padding: 1rem;
      max-width: 40rem;
    }
    .form__dropzone, .form__mapbox {
      margin-bottom: 1rem;
      min-height: 22rem;
    }
    .form__dropzone {
      text-align: center;
      border: 1px solid lightgray;
    }
    .form__mapbox {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
    .map {
        min-height: 10rem;
        height: 16rem;
    }
    span {
        display: block;
    }
    .dropzone__alert, .mapbox__alert, .mapbox__info {
      margin: 1rem 0;
      color: #bbb;
      font-style: italic;
      text-align: center;
    }
    .mapbox__alert, .dropzone__alert {
      display: none;
      font-size: 1.5rem;
      color: red;
    }
    div .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
      margin: 10px 5px 0 5px;
    }

    .form__field {
      display: block;
      margin-bottom: 1.25rem;
    }
    .field__span {
      display: block;
      margin-bottom: 5px;
      font-size: 1rem;
    }
    .field__input {
      width: 100%;
      height: 2.8rem;
      border: ${this.niceInput};
      padding: 0 1rem;
      outline: none;
      border-radius: 5px;
      font-size: 1rem;
      transition: all 0.3s;
    }
    .form__field input:focus { 
      border-color: #27ae60;
      box-shadow: inset 0 0 3px #2fd072;
    }

    .field__radius div {
      margin: 0 0 .5rem 1rem;
      display: inline;
    }
    `;

    this.shadow.innerHTML = `
    <link defer href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet" />

    <link defer rel="stylesheet" 
    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css" type="text/css" />

    <my-header></my-header>
    <section class="root">
      <h1>Reportar Mascota Perdida</h1>
      
      <div class="card">
        <form class="form">

          <my-input  span="Nombre" name="full_name" placeholder="Boomer"></my-input>

          <my-input  span="Raza" name="breed" placeholder="Tamaskan"></my-input>

          <my-input  span="Color" name="color" placeholder="Gris, negro y blanco"></my-input>

          <div class="form__field field__radius">
              <span class="field__span">Sexo</span>
      
              <div>
                  <input type="radio" id="male" name="sex" value="male" checked>
                  <label for="male">Macho</label>
              </div>
              
              <div>
                  <input type="radio" id="famale" name="sex" value="famale" checked>
                  <label for="famale">Hembra</label>
              </div>
          </div>
      
          <my-input span="Visto por última vez" name="date_last_seen" type="date"></my-input>
      
          <div class="form__dropzone form__field">
              <my-dropzone></my-dropzone>
              <span class="dropzone__alert">Por favor, añade una foto.</span>
          </div>
      
          <div class="form__mapbox">
            <div id="map" class="map"></div>

            <div class="mapbox__info">
                <span class="mapbox__alert">Por favor, añade una ubicación.</span>

                <span>Buscá un punto de referencia para reportar a tu mascota.</span>
                <span>Puede ser una dirección, un barrio o una ciudad.</span>
            </div>
          </div>
      
          <my-button class="button__confirm-report" margin="0 0 1.5rem 0" backgroundColor="#FF9DF5">Reportar como perdido</my-button>
          <my-button class="button__cancel-report" margin="0 0 1.5rem 0" backgroundColor="#CDCDCD">Cancelar</my-button>
        </form>
      </div>
    </section>`;

    this.shadow.appendChild(style);
  }
}

customElements.define("reportar-mascota-page", Report);
