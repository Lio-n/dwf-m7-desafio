class Button extends HTMLElement {
  shadow: ShadowRoot;
  color: string;
  backgroundColor: string;
  margin: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.color = this.getAttribute("color") || "black";
    this.backgroundColor = this.getAttribute("backgroundColor") || "white";
    this.margin = this.getAttribute("margin") || "0";
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    button {
        /* box-model */
        display: block;
        width: 100%;
        min-width: 13rem;
        margin: ${this.margin};
        /* visual */
        background-color: ${this.backgroundColor};
        color: ${this.color};
        border: none;
        height: 45px;
        border-radius: 5px;
        cursor: pointer;
        /* typography */
        font-size: 1.2rem;
        font-family: "Poppins";
        font-weight: 600;
        transition: all 0.4s ease-in-out;
    }
    button:hover {
      background-color: #fff;
      border: ${this.backgroundColor} 2px solid;
      color: ${this.backgroundColor};
    }
    `;

    this.shadow.innerHTML = `<button type="submit">${this.textContent}</button>`;
    this.shadow.appendChild(style);
  }
}

customElements.define("my-button", Button);
