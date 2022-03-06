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
    .home__title {
      color: #292643;
    }
    .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right {
      display: none;
    }


    span {
      display: block;
    }
    p, span {
      margin: 0;
    }
    .card__picture img {
      display: block;
      border-radius: 5px;
      object-fit: cover;
      width: 100%;
      height: 10rem;
    }
    
    .card__picture:hover img {
      filter: blur(1px);
    }

    .card__picture {
      position: relative;
    }
    .picture__layer {
      position: absolute;
      opacity: 0;
      width: 100%;
      z-index: 2;
      font-size: 1rem;
      padding: 1rem;
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-evenly;
      transition: all .3s ease-in-out;
      background-color: #0000008c;
      border-radius: 5px;
    }

    .card__picture:hover .picture__layer {
      opacity: 1;
    }
    .picture__layer p {
      color: #fff;
    }
    .picture__layer span {
      font-weight: bold;
      display: inline;
      color: #fff;
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
