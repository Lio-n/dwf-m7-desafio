import { Router } from "@vaadin/router";
import { state } from "../../state";

// # Eye Svg
const eye_open: string = require("../../assets/eye_open.svg");
const eye_closed: string = require("../../assets/eye_closed.svg");

class MisDatos extends HTMLElement {
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
    const showEye: HTMLImageElement = this.shadow.querySelector(".show__eye");
    const inputsArr: NodeListOf<HTMLInputElement> = this.shadow.querySelectorAll("my-input");

    let user_data = {
      full_name: undefined,
      pswrd_1: undefined,
      pswrd_2: undefined,
    };

    const checkInputs = () => {
      const btnSave: HTMLButtonElement = this.shadow.querySelector("my-button");

      // # Check if the value of each 'my-input' has been completed.
      let arr: Array<boolean> = [];
      btnSave.addEventListener("click", (e) => {
        e.preventDefault();

        inputsArr.forEach((item) => {
          let inputValue: string = item.shadowRoot.querySelector("input").value;
          let inputName: string = item.getAttribute("name");

          if (!inputValue) {
            arr.push(false);
            item.setAttribute("border-color", this.errorInput);
          } else {
            // # Set the value of each key.
            user_data[inputName] = inputValue;
            arr.push(true);
            item.setAttribute("border-color", this.niceInput);
          }
        });

        validateInputs(arr);
        arr = [];
      });
    };

    const validateInputs = async (arr) => {
      const passwordAlert: HTMLElement = this.shadow.querySelector(".alert");

      if (!arr.includes(false) && user_data.pswrd_1 == user_data.pswrd_2) {
        passwordAlert.style.display = "none";

        state.setState({ ...state.getState(), full_name: user_data.full_name });

        const alert__wait: HTMLElement = this.shadow.querySelector(".alert__wait");
        alert__wait.style.display = "block";

        await state.createUser(user_data.pswrd_1);

        const isAuth: boolean = await state.authUser(user_data.pswrd_1);

        if (isAuth) {
          Router.go("/");
        }
      } else {
        passwordAlert.style.display = "initial";
      }
    };

    const showPassword = () => {
      let user_pswrd = {
        pswrd_1: undefined,
        pswrd_2: undefined,
      };

      showEye.addEventListener("click", (e) => {
        e.preventDefault();

        inputsArr.forEach((item) => {
          let input: HTMLInputElement = item.shadowRoot.querySelector("input");
          let inputName: string = item.getAttribute("name");
          user_pswrd[inputName] = input;
        });

        if (user_pswrd.pswrd_1.type == "password" && user_pswrd.pswrd_2.type == "password") {
          user_pswrd.pswrd_1.type = "text";
          user_pswrd.pswrd_2.type = "text";
          showEye.src = this.eyeOpen;
        } else {
          user_pswrd.pswrd_1.type = "password";
          user_pswrd.pswrd_2.type = "password";
          showEye.src = this.eyeClosed;
        }
      });
    };

    showPassword();
    checkInputs();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
      display: flex;
      height: 80vh;
    }
      .card {
        padding: 20px 30px;
        width: 22rem;
        margin: auto;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        background-color: #fff;
      }
      .form__field {
        position: relative;
      }
      form .form__field .show {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        display: block;
      }
      form button {
        width: 100%;
        height: 45px;
        margin: 3px 0 10px 0;
        border: none;
        outline: none;
        background: #27ae60;
        border-radius: 5px;
        color: #fff;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 1px;
        text-transform: uppercase;
        cursor: no-drop;
        opacity: 0.7;
      }
      form button.active{
        cursor: pointer;
        opacity: 1;
        transition: all 0.3s;
      }
      form button.active:hover{
        background: #219150;
      }
      .show__eye {
        width: 2rem;
        display: block;
      }
      .full_name {
        margin-bottom: 2rem;
      }
      .password__alert {
        text-align: center;
        margin: 1rem 0;
      }
      .alert {
        text-align: center;
        font-style: italic;
        font-size: 1rem;
        color: red;
        display: none;
      }
      .alert__wait  {
        display: none;
        text-align: center;
        margin: .5rem 0;
        color: #666f88;
      }
    `;

    this.shadow.innerHTML = `
    <my-header></my-header>
    <section class="root">
        <div class="card">
            <form class="form">
                
                <my-input span="Usuario" name="full_name" placeholder="Usuario"></my-input>

                <my-input span="Contraseña" name="pswrd_1" type="password" placeholder="Contraseña"></my-input>

                <div class="form__field">
                  <my-input name="pswrd_2" type="password" placeholder="Confirmar Contraseña"></my-input>

                  <div class="show">
                    <img class="show__eye" src="${this.eyeClosed}"/>
                  </div>
                </div>
                
                <div class="password__alert">
                  <span class="alert">Por favor, ingrese la misma contraseña.</span>
                </div>

                <span class="alert__wait">Actualizando Mis datos...</span>
                <my-button color="#fff" backgroundColor="#00C897">Guardar</my-button>
            </form>
        </div>
    </section>`;

    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("mis-datos-page", MisDatos);
