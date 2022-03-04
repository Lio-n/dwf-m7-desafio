import { state } from "../../state";
import { getCurrentPosition } from "../../lib/mapbox";

class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
    this._listeners();
  }
  _listeners() {
    const map: HTMLElement = this.shadow.querySelector("#mapNext");
    state.showAllLostPets(map);

    const home__location: HTMLElement = this.shadow.querySelector(".home__location");
    const button: HTMLButtonElement = this.shadow.querySelector(".get__location");

    button.addEventListener("click", (e) => {
      e.preventDefault();

      getCurrentPosition();
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    #mapNext {
      height: 88vh;
      width: 100vw;
    }
    .picture__pet {
      width: 3rem;
      height: 3rem;
      border-radius: 100%;
      background-repeat: round;
    }
    my-report {
      display: none;
    }
    .report {
      display: block;
      text-align: center;
    }
    .pet__report  {
      color: #D82148;
      font-weight: bold;
      cursor: pointer;
    }
    .pet__report:hover {
      text-decoration: underline;
    }
    .mapboxgl-popup-content {
      border-radius: 5px;
      width: 16rem;
    }
    .mapboxgl-popup-close-button {
      margin-right: .1rem;
    }
    .card__info {
      font-size: .8rem;
    }
    .card__info p {
      color: #094f6e;
      margin-bottom: .5rem;
    }
    .card__info span {
      font-weight: bold;
      color: #292643;
    }
    .pet__report {
      display: inline-block;
      margin-top: .5rem;
      font-weight: bold;
      text-align: center;
      width: 100%;
      font-size: 1rem;
    }
    .home {
      display: flow-root;
    }
    .home__location {
      margin: 2.5rem auto;
      text-align: center;
      max-width: 22rem;
    }
    .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right {
      display: none;
    }
    `;

    this.shadow.innerHTML = `
    <link defer href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet" />

    <link defer rel="stylesheet" 
    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css" type="text/css" />

    <div class="root">
      <my-header></my-header>
      <div class="home">
        
        <div class="home__location">
            <h1 class="home__title">Solo puedes reportar mascotas cerca de tu ubicación</h1>
            <my-button class="get__location" color="#fff" margin="1.5rem 0 0" backgroundColor="#2d7a9c">Dar mi ubicación</my-button>
        </div>

        
        <div class="form__mapbox">
            <div id="mapNext"></div>
        </div>
      </div>
      
    </div>

      `;
    this.shadow.appendChild(style);
  }
}

customElements.define("home-page", Home);
