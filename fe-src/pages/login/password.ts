import { Router } from "@vaadin/router";
import { state } from "../../state";

// # Eye Svg
const eye_open: string = require("../../assets/eye_open.svg");
const eye_closed: string = require("../../assets/eye_closed.svg");

class Password extends HTMLElement {
  shadow: ShadowRoot;
  eyeOpen: string = eye_open;
  eyeClosed: string = eye_closed;
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
    const pswrd_1: HTMLInputElement = this.shadow.querySelector("#pswrd_1");
    const showEye: HTMLImageElement = this.shadow.querySelector(".show__eye");
    const myButton: HTMLButtonElement = this.shadow.querySelector("my-button");
    const alertPassword: HTMLTitleElement = this.shadow.querySelector(".alert__incorrect-password");

    let isPasswordOk: boolean = false;
    myButton.addEventListener("click", async (e) => {
      e.preventDefault();

      if (pswrd_1.value != "") {
        pswrd_1.style.border = this.niceInput;
        isPasswordOk = true;
      } else {
        pswrd_1.style.border = this.errorInput;
        isPasswordOk = false;
      }

      if (isPasswordOk) {
        const isAuthed: boolean = await state.authUser(pswrd_1.value);

        isAuthed ? Router.go("/") : (alertPassword.style.display = "block");
      }
    });

    const showPassword = (): void => {
      showEye.addEventListener("click", (e) => {
        e.preventDefault();
        if (pswrd_1.type == "password") {
          pswrd_1.type = "text";
          showEye.src = this.eyeOpen;
        } else {
          pswrd_1.type = "password";
          showEye.src = this.eyeClosed;
        }
      });
    };

    showPassword();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
      display: flex;
      height: 80vh;
    }
      .card {
        margin: auto;
        padding: 20px 30px;
        width: 22rem;
        border-radius: 5px;
        box-shadow: 0 0 10px rgb(0 0 0 / 20%);
        background-color: #fff;
      }
      .form__field {
        margin-bottom: 1.25rem;
        position: relative;
      }
      input {
        border: ${this.niceInput};
        height: 2.8rem;
        padding: 0 1rem;
        outline: none;
        border-radius: 5px;
        font-size: 1rem;
        position: relative;
        width: 100%;
        transition: all 0.3s;
      }
      form .form__field input:focus { 
        border-color: #27ae60;
        box-shadow: inset 0 0 3px #2fd072;
      }
      form .form__field .show {
        position: absolute;
        right: 10px;
        top: 50%;
        cursor: pointer;
        display: block;
      }
      
      .show__eye {
        width: 2rem;
        display: block;
      }
      .full_name {
        margin-bottom: 2rem;
      }
      .alert__incorrect-password {
        display: none;
      }
      .field__span {
        display: block;
        margin-bottom: 5px;
        font-size: 1rem;
        font-weight: 500;
        color: #292643;
      }
    `;

    this.shadow.innerHTML = `
    <my-header></my-header>
    <section class="root">
        <div class="card">
            <form class="form">

                <div class="form__field">
                  <span class="field__span">Contraseña</span>
                  <input id="pswrd_1" type="password" placeholder="Contraseña">
                  <div class="show">
                    <img class="show__eye" src="${this.eyeClosed}"/>
                  </div>
                </div>
                
                <my-button color="#fff" backgroundColor="#27ae60">Guardar</my-button>
            </form>
        </div>
    </section>`;

    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("password-page", Password);
