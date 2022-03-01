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
    .home__cont-title {
      font-size: 2rem;
      color: blue;
    }
    #mapNext {
      height: 100vh;
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
    .pet__report {
      cursor: pointer;
    }
    .mapboxgl-popup-content {
      border-radius: 5px;
    }
    .mapboxgl-popup-close-button {
      margin-right: .1rem;
    }
    .card__info {
      font-size: .8rem;
    }
    .card__info p {
      color: hsl(222deg 89% 45%);
      margin-bottom: .5rem;
    }
    .card__info span {
      font-weight: bold;
      color: hsl(233deg 92% 15%);
    }
    .pet__report {
      display: inline-block;
      margin-top: .5rem;
      font-weight: bold;
      text-align: center;
      width: 100%;
    }
    `;

    this.shadow.innerHTML = `
    <link defer href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet" />

    <link defer rel="stylesheet" 
    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css" type="text/css" />

    <div class="home">
      <my-header></my-header>
      <div class="home__cont-title">
        <h4>Solo puedes reportar mascotas cerca de tu ubicación</h4>
        <button class="get__location">Dar mi ubicación</button>

        
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
