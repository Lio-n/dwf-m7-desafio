import { Router } from "@vaadin/router";
import { state } from "../../state";

class MyPet extends HTMLElement {
  shadow: ShadowRoot;
  pets;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  async connectedCallback() {
    this.pets = await state.getPets();
    this.render();
  }
  _listeners() {
    this.shadow.querySelector(".list").addEventListener("report", async (e: any) => {
      await state.getOnePet(e.detail.petId);
      Router.go("/mis-mascotas/editar");
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: space-around;
      padding:  4rem 2rem;
    }`;

    this.shadow.innerHTML = `
    <my-header></my-header>
    <section class="root">
        <h1 style="display: inline;">Mis mascotas Reportadas</h1>

        <div class="list">
            ${this.pets
              .map((pet) => {
                return `<my-pet picture="${pet.pictureUrl}" name="${pet.full_name}" pet-id="${pet.id}"></my-pet>`;
              })
              .join("")}
        </div>
        
    <section>
      `;
    this.shadow.appendChild(style);
    this._listeners();
  }
}

customElements.define("mis-mascotas-page", MyPet);
