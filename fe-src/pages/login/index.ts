import { Router } from "@vaadin/router";
import { state } from "../../state";

class Login extends HTMLElement {
  shadow: ShadowRoot;
  errorInput: string = "1px solid red";
  niceInput: string = "1px solid lightgrey";
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  addListener() {
    const checkUser = () => {
      const alert__wait: HTMLElement = this.shadow.querySelector(".alert__wait");

      const validateEmail = (email) => {
        const res =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(email);
      };

      const myButton: HTMLElement = this.shadow.querySelector("my-button");
      const myInput: HTMLElement = this.shadow.querySelector("my-input");

      myButton.addEventListener("click", async (e) => {
        e.preventDefault();
        let email = myInput.shadowRoot.querySelector("input").value;
        let isValid = validateEmail(email);

        if (!!email && isValid) {
          myInput.setAttribute("border-color", this.niceInput);
          myButton.shadowRoot.querySelector("button").setAttribute("disabled", "");

          const existsUser: boolean = await state.checkUser(email);

          existsUser ? Router.go("/login/password") : Router.go("/mis-datos");
        } else {
          myInput.setAttribute("border-color", this.errorInput);
        }
      });
    };
    checkUser();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
      display: flex;
      height: 80vh;
    }
    .login {
      width: 22rem;
      margin: auto;
      box-shadow: 0 0 10px rgb(0 0 0 / 20%);
      padding: 20px 30px;
      border-radius: 5px;
      background-color: #fff;
    }
    .alert__wait {
      display: none;
    }
    `;

    this.shadow.innerHTML = `
    <my-header></my-header>
    <section class="root">
        <div class="login">
        
        <form class="form">
            <my-input span="Email" type="email" placeholder="john.doe@example.com..."></my-input>
            <span class="alert__wait">Por favor, espere.</span>
            <my-button color="#fff" backgroundColor="#2d7a9c">Ingresar</my-button>
        <form>
        </div>
    <section>
      `;
    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("login-page", Login);
