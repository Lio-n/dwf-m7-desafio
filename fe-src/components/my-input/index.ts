class Input extends HTMLElement {
  shadow: ShadowRoot;
  border_Color: string;
  span: string;
  place_holder: string;
  name: string;
  type: string;
  setValue;
  height;
  margin;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.span = this.getAttribute("span") || "";
    this.type = this.getAttribute("type") || "text";
    this.border_Color = this.getAttribute("border_Color") || "1px solid lightgrey";
    this.place_holder = this.getAttribute("placeholder") || "";
    this.name = this.getAttribute("name") || "";
    this.setValue = this.getAttribute("set-value") || "";
    this.height = this.getAttribute("height") || "2.8rem";
    this.margin = this.getAttribute("margin") || "0 0 1.25rem 0";
  }

  static get observedAttributes() {
    return ["border-color", "type"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name == "border-color" && oldVal != newVal) {
      this._changeStyles({ border: newVal });
    }
  }

  connectedCallback() {
    this.render();
  }
  _changeStyles(styles) {
    const el: HTMLElement = this.shadowRoot.querySelector("input");

    Object.keys(styles).forEach((styleKey) => {
      el.style[styleKey] = styles[styleKey];
    });
  }

  _setTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
    <label class="label">
        <span class="label__span">${this.span}</span>
        <input value="${this.setValue}" class="label__input" name="${this.name}" type="${
      this.type
    }" placeholder="${this.place_holder}" />
    </label>
    <style>${this._setStyles()}</style>
    `;

    return template;
  }
  _setStyles() {
    return `*{margin:0;padding:0;box-sizing: border-box;}
  .label {
    display: block;
    margin: ${this.margin};
  }
  .label__span {
    display: block;
    margin-bottom: 5px;
    font-size: 1rem;
  }
  .label__input {
    border: solid 1px lightgrey;
    width: 100%;
    height: ${this.height};
    padding: 0 1rem;
    outline: none;
    border-radius: 5px;
    font-size: 1rem;
    position: relative;
    transition: all 0.3s;
  }
  .label input:focus { 
    border-color: #27ae60;
    box-shadow: inset 0 0 3px #2fd072;
  }
  `;
  }

  render() {
    this.shadow.appendChild(this._setTemplate().content.cloneNode(true));
  }
}

customElements.define("my-input", Input);
