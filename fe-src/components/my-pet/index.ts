const update_icon = require("../../assets/update_icon.svg");

class Pet extends HTMLElement {
  shadow: ShadowRoot;
  pet_picture: string;
  full_name: string;
  petId: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.pet_picture = this.getAttribute("picture");
    this.full_name = this.getAttribute("name");
    this.petId = this.getAttribute("pet-id");
  }
  connectedCallback() {
    this.render();
  }
  _listeners() {
    this.shadow.querySelector(`.card`).addEventListener("click", () => {
      const event = new CustomEvent("report", {
        detail: { petId: this.petId },
        bubbles: true,
      });
      this.dispatchEvent(event);
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .card {
        /* box-model */
        width: 20rem;
        margin-bottom: 3rem;
        max-height: 24.5rem;
        padding: .5rem;
        /* visual */
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 0 10px #d5d1d1;
    }
    .pet {
        position: relative;
    }
    .pet__layer {
        /* box model */
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        cursor: pointer;
        /* visual */
        border-radius: 5px;
        opacity: 0;
        transition: all .3s ease-in-out;
    }
    .pet:hover .pet__layer {
        opacity: 1;
    }
    .pet:hover .pet__picture {
        filter: blur(1px);
    }
    .pet_full-name {
        margin: .5rem 0 0 .5rem;
    }
    .picture__update {
        width: 48px;
        height: 48px;
    }
    .pet__picture {
        object-fit: cover;
        width: 100%;
        border-radius: 5px;
        height: 20rem;
        display: block;
    }
    `;

    this.shadow.innerHTML = `
    <div class="card">
        <div class="pet">
            <div class="pet__layer">
                <img class="picture__update" src="${update_icon}" />
            </div>
            <img class="pet__picture" src="${this.pet_picture}" />
        </div>
        <h2 class="pet_full-name">${this.full_name}</h2>
    </div>`;
    this.shadow.appendChild(style);
    this._listeners();
  }
}

customElements.define("my-pet", Pet);
