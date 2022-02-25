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
  async _listeners() {
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
      text-align: center;
      font-size: 2rem;
      color: blue;
    }
    #mapNext {
      height: 65vh;
    }
    .picture__pet {
      width: 3rem;
      height: 3rem;
      border-radius: 100%;
      background-repeat: round;
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

        
        <h1>Home</h1>
        <h1>Home</h1>
        <h1>Home</h1>
        <h1>Home</h1>
        <h1>Home</h1>
        <h1>Home</h1>
      </div>
      
    </div>

      `;
    this.shadow.appendChild(style);
  }
}

customElements.define("home-page", Home);
