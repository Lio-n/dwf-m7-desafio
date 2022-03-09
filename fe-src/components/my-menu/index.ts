import { state } from "../../state";
import { Router } from "@vaadin/router";

const monster_icon = require("../../assets/monster_icon.svg");
const arrow_down = require("../../assets/arrow_down.svg");
const user_icon = require("../../assets/user_icon.svg");
const dog_icon = require("../../assets/dog_icon.svg");
const megaphone_icon = require("../../assets/megaphone_icon.svg");
const signout_icon = require("../../assets/signout_icon.svg");
const signin_icon = require("../../assets/signin_icon.svg");
const createAccount_icon = require("../../assets/create-account_icon.svg");

class Menu extends HTMLElement {
  shadow: ShadowRoot;
  template;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.template = document.createElement("template");
  }
  static get observedAttributes() {
    return ["state"];
  }
  connectedCallback() {
    this.render();
    this._listeners();
  }
  _listeners() {
    const menu__logout = this.shadow.querySelector(".menu__logout");
    menu__logout.addEventListener("click", (e) => {
      Router.go("/login");
      state.logoutUser();
    });
  }
  attributeChangedCallback(name, oldVal, newVal) {}
  _setTemplate() {
    this.template.innerHTML = `
        <div class="menu__avatar">
            <img class="avatar__icon-monster" src="${monster_icon}" />
            <img class="avatar__icon-arrow-down" src="${arrow_down}" />
        </div>

        <nav class="menu__state">
            <ul>
                <li><a href="/login"><img src="${signin_icon}" />Iniciar Secion</a></li>
                <li><a href="/login"><img src="${createAccount_icon}" />Crear Cuenta</a></li>
                <li class="menu__logout" style="display: none;"><img src="${signout_icon}" />Cerrar Sesion</li>
            </ul>
        </nav>
        <style>${this._setStyles()}</style>`;

    if (this.hasAttribute("state")) {
      this.template.innerHTML = `
        <div class="menu__avatar">
            <img class="avatar__icon-monster" src="${monster_icon}" />
            <h2 class="avatar__full_name">Lean</h2>
            <img class="avatar__icon-arrow-down" src="${arrow_down}" />
        </div>

        <nav class="menu__state">
            <ul>
                <a href="/mis-datos">
                  <li>
                      <img src="${user_icon}" />Mis datos
                  </li>
                </a>
                <a href="/mis-mascotas">
                  <li>
                      <img src="${dog_icon}" />Mis mascotas
                  </li>
                </a>
                <a href="/reportar">
                  <li>
                      <img src="${megaphone_icon}" />Reportar mascota
                  </li>
                </a>
                <li class="menu__logout"><img src="${signout_icon}" />Cerrar Sesion</li>
            </ul>
        </nav>
        <style>${this._setStyles()}</style>`;
    }

    return this.template;
  }

  _setStyles() {
    return `*{margin:0;padding:0;box-sizing: border-box; letter-spacing: 1px; letter-spacing: normal;}
    li {
      list-style-type: none;
    }
    a, .menu__logout {
      text-decoration: none;
      font-weight: 600;
      color: #292643;
    }
    img {
      width: 24px;
      height: 24px;
      vertical-align: text-top;
    }
    .menu__logout:hover {
      color: #fff;
    }
    .menu__avatar {
      display: flex;
      gap: .5rem;
      align-items: center;
      cursor: pointer;
    }
    .menu__state img {
      margin-right: .5rem;
    }
    
    .menu__avatar:hover + .menu__state {
      display: initial;
    }
    .avatar__icon-monster {
      width: 2rem;
      height: 2rem;
    }
    .avatar__full_name {
      color: #04b471;
    }
    .avatar__icon-arrow-down {
      width: 1.5rem;
    }
    
    .menu__state {
      position: absolute;
      background-color: #2d7a9c;
      border-radius: 5px;
      display: none;
      top: 70%;
      right: 0;
      margin-right: 2rem;
      box-shadow: 0 0 10px rgb(0 0 0 / 20%);
    }
    li {
      padding: 1rem;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }
    li:nth-child(1) {
      border-radius: 5px 5px 0 0;
    }
    li:nth-child(4) {
      border-radius: 0 0 5px 5px;
    }
    li:hover {
      background-color: #00c897;
    }
    li:hover a {
      color: #fff;
    }

    .menu__state:hover {
      display: initial;
    }
  `;
  }
  render() {
    this.shadow.appendChild(this._setTemplate().content.cloneNode(true));
  }
}

customElements.define("my-menu", Menu);
