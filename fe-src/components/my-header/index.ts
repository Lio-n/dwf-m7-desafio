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
  addListener() {
    const routerBtn = () => {
      const buttonEl: HTMLButtonElement[] = Array.from(this.shadow.querySelectorAll("my-button"));

      buttonEl.map((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          Router.go("/login");
        });
      });
    };

    const isAuth = () => {
      const myMenuFalse: HTMLElement = this.shadow.getElementById("false");
      const myMenuTrue: HTMLElement = this.shadow.getElementById("true");

      const { TOKEN } = state.getState();

      if (TOKEN) {
        myMenuFalse.style.display = "none";
        myMenuTrue.style.display = "flex";
      } else {
        myMenuFalse.style.display = "block";
        myMenuTrue.style.display = "none";
      }
    };

    isAuth();
    routerBtn();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    header {
        width: 100%;
        background-color: #094f6e;
        padding: 1rem;
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
    }
    .header__menu-burger {
        width: 3rem;
    }
    .cont__login {
        display: flex;
        justify-content: center;
        text-align: center;
    }
    .login {
        display: none;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        top: 260px;
        padding: 1rem;
        background-color: #ff00d4;
        border-radius: 7px;
        width: 290px;
    }
    .login__cont-btn {
        margin: 0 auto;
    }
    .login__close {
        text-align: end;
        margin-bottom: .5rem;
    }`;

    this.shadow.innerHTML = `
    <header>
      <img class="header__logo" href="/" src="${paw_svg}"/>
      
      <div class="cont__login">

        <div class="login">
          <span class="login__close">X</span>
          <div class="login__cont-btn">
            <my-button margin="0 0 1.5rem 0" color="blue" backgroundColor="skyblue">Iniciar Sesion</my-button>
            <my-button backgroundColor="yellow">Crear Cuenta</my-button>
          </div>
        </div>
      
      </div>

      <div class="container__menu">
        <my-menu id="false"></my-menu>
        <my-menu id="true" style="display: none"></my-menu>
      </div>

    </header>
      `;
    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("my-header", Header);
