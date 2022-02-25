import { Router } from "@vaadin/router";
import { state } from "../../state";

class Login extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  addListener() {
    const checkUser = () => {
      const formEl: HTMLFormElement = this.shadow.querySelector(".form");

      formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { email } = e.target as any;

        const existsUser: boolean = await state.checkUser(email.value);

        existsUser ? Router.go("/login/password") : Router.go("/mis-datos");
      });
    };
    checkUser();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}`;

    this.shadow.innerHTML = `
    <my-header></my-header>
    <section role="main">
        <h1>Ingresar</h1>
        
        <form class="form">
            <label>Email</label>
            <input name="email" placeholder="john.doe@example.com..."/>
            <button type="submit" is="my-button">click me</button>
        <form>
    <section>
      `;
    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("login-page", Login);
