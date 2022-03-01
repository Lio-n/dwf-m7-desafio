import { state } from "../../state";

class Report extends HTMLElement {
  shadow: ShadowRoot;
  pet_id;
  pet_pictureUrl;
  full_name;
  color;
  breed;
  sex;
  published_by;
  errorInput: string = "1px solid red";
  niceInput: string = "1px solid lightgrey";
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    this.pet_pictureUrl = this.getAttribute("pet_pictureUrl") || "";
    this.pet_id = this.getAttribute("pet_id") || "";
    this.published_by = this.getAttribute("published_by") || "";
    this.full_name = this.getAttribute("full_name");
    this.color = this.getAttribute("color");
    this.breed = this.getAttribute("breed");
    this.sex = this.getAttribute("sex");
  }
  connectedCallback() {
    this.render();
    this._listeners();
  }
  _listeners() {
    const validatePhoneNumber = (input_str) => {
      const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

      return re.test(input_str);
    };

    let report_data = {
      full_name: undefined,
      phone_number: undefined,
      message: undefined,
      pet_id: this.pet_id,
      published_by: this.published_by,
    };

    const alert__phoneNumber: HTMLElement = this.shadow.querySelector(".alert__phone-number");

    const checkInputs = () => {
      const inputsArr: NodeListOf<HTMLInputElement> = this.shadow.querySelectorAll("my-input");
      const btnSave: HTMLButtonElement = this.shadow.querySelector("my-button");
      const textarea = this.shadow.querySelector("textarea");

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
            report_data[inputName] = inputValue;
            arr.push(true);
            item.setAttribute("border-color", this.niceInput);
          }
        });

        if (textarea.value != "") {
          arr.push(true);
          report_data.message = textarea.value;

          textarea.style.border = this.niceInput;
        } else {
          arr.push(false);
          textarea.style.border = this.errorInput;
        }

        validateInputs(arr);
        arr = [];
      });
    };

    const validateInputs = async (arr) => {
      if (!arr.includes(false)) {
        const isValidate = validatePhoneNumber(report_data.phone_number);

        if (isValidate) {
          alert__phoneNumber.style.display = "none";
          const alert__reportSent: HTMLElement = this.shadow.querySelector(".alert__report-sent");

          const isReported: boolean = await state.sendReport(report_data);

          isReported ? (alert__reportSent.style.display = "block") : "";
        } else {
          alert__phoneNumber.style.display = "inline-block";
        }
      }
    };

    checkInputs();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .card {
      max-width: 22rem;
      padding: 1rem;
    }
    .card__picture img {
      width: 100%;
      height: 100%;
    }
    .card__form {
      font-size: 1rem;
    }
    textarea {
      resize: none;
      width: 100%;
      height: 5rem;
      border: 1px solid lightgrey;
      padding: .5rem 1rem;
      border-radius: 5px;
      font-size: 1rem;
      font-family: Helvetica Neue,Arial,Helvetica,sans-serif;
    }
    span {
      display: block;
      margin-bottom: 5px;
    }

    .card__picture img {
      display: block;
      border-radius: 5px;
      height: 9rem;
      object-fit: cover;
    }
    .card__picture {
      position: relative;
      margin-bottom: .5rem;
    }
    .picture__layer {
      position: absolute;
      opacity: 0;
      width: 100%;
      z-index: 2;
      font-size: 1rem;
      padding: 1rem;
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-evenly;
      transition: all .3s ease-in-out;
    }
    p, span {
      margin: 0;
    }
    .card__picture:hover img {
      filter: blur(1px);
    }
    .card__picture:hover .picture__layer {
      opacity: 1;
    }
    .picture__layer p {
      color: hsl(222deg 89% 45%);
    }
    .picture__layer span {
      font-weight: bold;
      display: inline;
      color: hsl(233deg 92% 15%);
    }
    label {
      display: block;
      margin-bottom: .5rem;
    }
    .alert__phone-number {
        display: none;
        color: red;
        font-size: .8rem;
        text-align: center;
        margin-bottom: .5rem;
    }
    .alert__report-sent {
      display: none;
      text-align: center;
      margin: .5rem 0;
      color: #00ff4e;
    } 
    `;

    this.shadow.innerHTML = `
    <div class="card__layer">
            <div class="card__picture">
                <div class="picture__layer">
                        <p><span>Color:</span>${this.color}</p>
                        <p><span>Sexo:</span>${this.sex}</p>
                        <p><span>Raza:</span>${this.breed}</p>
                </div>
                <img src="${this.pet_pictureUrl}"/>
            </div>
  
            <form class="card__form">
              <my-input height="2rem" span="Tu Nombre" name="full_name" placeholder="John Doe"></my-input>
              <my-input height="2rem" span="Tu Teléfono" type="tel" name="phone_number" placeholder="+5491830000"></my-input>
              <span class="alert__phone-number">Por favor ingrese un número de teléfono válido</span>
              <label>
                  <span>Dondé lo viste?</span>
                  <textarea name="message"></textarea>
              </label>
              <span class="alert__report-sent">¡Reportado con Exito!</span>

              <my-button backgroundColor="#FF9DF5">Enviar<my-button>
            </form>
        </div>`;
    this.shadow.appendChild(style);
  }
}

customElements.define("my-report", Report);
