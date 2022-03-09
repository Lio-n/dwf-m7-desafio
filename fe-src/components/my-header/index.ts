import { Router } from "@vaadin/router";
import { state } from "../../state";
const paw_svg = require("../../assets/paw_favicon.svg");

class Header extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  _listeners() {
    const header__logo: HTMLImageElement = this.shadow.querySelector(".header__logo");
    header__logo.addEventListener("click", () => {
      Router.go("/");
    });

    const isAuth = () => {
      const container__menu: HTMLElement = this.shadow.querySelector(".container__menu");
      const my_menu: HTMLElement = document.createElement("my-menu");

      const { TOKEN } = state.getState();

      TOKEN ? my_menu.setAttribute("state", "") : my_menu.removeAttribute("state");

      container__menu.appendChild(my_menu);
    };

    isAuth();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    header {
        width: 100%;
        background-color: #094f6e;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        z-index: 3;
        top: 0;
    }
    .header__logo {
        width: 3rem;
        height: 3rem;
        cursor: pointer;
    }`;

    this.shadow.innerHTML = `
    <header>
      <img class="header__logo" src="${paw_svg}"/>

      <div class="container__menu"></div>
    </header>
      `;
    this.shadow.appendChild(style);
    this._listeners();
  }
}

customElements.define("my-header", Header);
