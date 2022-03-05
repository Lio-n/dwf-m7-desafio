import { getLocationBySearch } from "../../lib/mapbox/mapbox-geocoding";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Edit_Report extends HTMLElement {
  shadow: ShadowRoot;
  errorInput: string = "1px solid red";
  niceInput: string = "1px solid lightgrey";
  pet;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  async connectedCallback() {
    this.pet = await state.getState().pet;
    this.pet.date_last_seen = new Date(this.pet.date_last_seen).toISOString().substring(0, 10);
    this.render();
    this._listeners();
  }
  _listeners() {
    const changeStateOfPet = () => {
      const btnChangeState: HTMLButtonElement = this.shadow.querySelector(".button__change-state");
      btnChangeState.addEventListener("click", (e) => {
        e.preventDefault();

        this.pet.state == "lost" ? (this.pet.state = "found") : (this.pet.state = "lost");

        state.updatePet(this.pet);
        Router.go("/mis-mascotas");
      });
    };
    changeStateOfPet();

    const deleteReport = () => {
      const deleteReport = this.shadow.querySelector(".delete__report");

      deleteReport.addEventListener("click", async (e) => {
        e.preventDefault();
        await state.deletePet(this.pet.id);
        Router.go("/mis-mascotas");
      });
    };
    deleteReport();

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

    const checkInputs = (): void => {
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

    const validateInputs = async (arr): Promise<void> => {
      const mapboxAlert: HTMLElement = this.shadow.querySelector(".mapbox__alert");
      const dropzoneAlert: HTMLElement = this.shadow.querySelector(".dropzone__alert");

      !!this.pet.last_location_lat
        ? (mapboxAlert.style.display = "none")
        : (mapboxAlert.style.display = "initial");

      !!this.pet.pictureUrl
        ? (dropzoneAlert.style.display = "none")
        : (dropzoneAlert.style.display = "initial");

      if (!arr.includes(false) && !!this.pet.last_location_lat) {
        radiusInput.forEach((item) => {
          const { value, checked } = item;
          if (checked) pet_layer.sex = value;
        });

        let pet = this.pet;
        // # Set the value of 'pet_layer' to 'pet'.
        Object.keys(this.pet).forEach(function (key) {
          if (pet_layer[key] != undefined) {
            pet[key] = pet_layer[key];
          }
        });

        const alert__wait: HTMLElement = this.shadow.querySelector(".alert__wait");
        alert__wait.style.display = "block";

        await state.updatePet(this.pet);
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
        padding: 0 1rem 2rem;
    }

    .form {
      margin: 0 auto;
      padding: 1rem;
      max-width: 40rem;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px #d5d1d1;
    }
    .form__dropzone, .form__mapbox {
      margin-bottom: 1rem;
      min-height: 22rem;
    }
    .form__dropzone {
      text-align: center;
      border: 1px solid lightgray;
      border-radius: 5px;
    }
    .form__mapbox {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
    .map {
      min-height: 10rem;
      height: 22rem;
      border-radius: 5px;
      position: relative;
      z-index: 0;
    }
    span {
        display: block;
    }
    .dropzone__alert, .mapbox__alert, .mapbox__info {
      margin: 1rem 0;
      color: #2d7a9c;
      font-style: italic;
      text-align: center;
    }
    .mapbox__alert, .dropzone__alert {
      display: none;
      font-size: 1rem;
      color: #D82148;
      font-weight: bold;
    }
    div .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
      margin: 10px 5px 0 5px;
    }

    .form__field {
      display: block;
      margin-bottom: 1.25rem;
      letter-spacing: 1px;
    }
    .field__span {
      display: block;
      margin-bottom: 5px;
      font-size: 1rem;
      font-weight: 500;
      color: #292643;
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
    .root__title {
      margin: 2.5rem 0;
      color: #292643;
    }
    .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right {
      display: none;
    }
    .delete {
      display: block;
      text-align: center;
    }
    .delete__report {
      color: #D82148;
      font-weight: bold;
      cursor: pointer;
    }
    .delete__report:hover {
      text-decoration: underline;
    }
    .alert__wait  {
      display: none;
      text-align: center;
      margin: .5rem 0;
      color: #666f88;
    }
    `;

    this.shadow.innerHTML = `
    <link defer href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet" />

    <link defer rel="stylesheet" 
    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css" type="text/css" />

    <my-header></my-header>
    <section class="root">
      <h1 class="root__title">Editar Reporte</h1>
      
      <div class="card">
        <form class="form">

          <my-input set-value="${
            this.pet.full_name
          }" span="Nombre" name="full_name" placeholder="Boomer"></my-input>

          <my-input set-value="${
            this.pet.breed
          }" span="Raza" name="breed" placeholder="Tamaskan"></my-input>

          <my-input set-value="${
            this.pet.color
          }" span="Color" name="color" placeholder="Gris, negro y blanco"></my-input>

          <div class="form__field field__radius">
              <span class="field__span">Sexo</span>
      
              <div>
                  <input type="radio" id="male" name="sex" value="male" ${
                    this.pet.sex == "male" ? "checked" : ""
                  }>
                  <label for="male">Macho</label>
              </div>
              
              <div>
                  <input type="radio" id="famale" name="sex" value="famale" ${
                    this.pet.sex == "female" ? "checked" : ""
                  }>
                  <label for="famale">Hembra</label>
              </div>
          </div>
      
          <my-input set-value="${
            this.pet.date_last_seen
          }" span="Visto por última vez" name="date_last_seen" type="date"></my-input>
      
          <div class="form__dropzone form__field">
              <my-dropzone src="${this.pet.pictureUrl}"></my-dropzone>
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
          
          <span class="alert__wait">Actualizando Reporte...</span>
          <my-button class="button__confirm-report" margin="0 0 1.5rem 0" color="#fff" backgroundColor="#00C897">Guardar</my-button>
          <my-button class="button__change-state" margin="0 0 1.5rem 0" backgroundColor="#ffd700" color="#fff">Reportar como ${
            this.pet.state == "lost" ? "encontrado" : "perdido"
          }</my-button>

          <div class="delete">
            <a class="delete__report">Borrar reporte</a>
          </div>


        </form>
      </div>
    </section>`;

    this.shadow.appendChild(style);
  }
}

customElements.define("editar-reporte", Edit_Report);
