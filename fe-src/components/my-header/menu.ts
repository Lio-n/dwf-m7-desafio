export class Menu extends HTMLElement {
  shadow: ShadowRoot;
  closeURL: string =
    "https://raw.githubusercontent.com/Lio-n/FM-rock-paper-scissors/f6f07ed2a35bfeb7515f66990d3125efda9fcdda/src/assets/images/icon-close.svg";
  isAuth: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.isAuth = this.getAttribute("id");
  }
  connectedCallback() {
    this.render();
  }
  addListener() {
    const enableMenu = () => {
      const menuBurger = this.shadow.querySelector(".button");
      const subMenuNav = this.shadow.querySelector(".nav");
      let menuOpen: boolean = false;

      menuBurger.addEventListener("click", (e) => {
        e.preventDefault();
        if (!menuOpen) {
          menuBurger.classList.add("open");
          subMenuNav.classList.add("center");
          menuOpen = true;
        } else {
          menuBurger.classList.remove("open");
          subMenuNav.classList.remove("center");
          menuOpen = false;
        }
      });
    };

    enableMenu();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `* {box-sizing: border-box;margin: 0;padding: 0;}
    .home__menu-items {
      display: flex;
      font-size: 20px;
      list-style: none;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .home__item {
      border-radius: 5px;
      transition: all 0.5s ease-in-out;
      width: max-content;
    }
    .home__item > a:hover {
      color: #094f6e;
    }
    .home__item:hover {
      background-color: #dadfea;
    }
    .home__item > a {
      color: #fff;
      display: none;
      text-decoration: none;
      padding: 10px;
    }
    @media (min-width: 768px) {
      .home__item > a {
        display: inherit;
        height: 100%;
      }
      .button {
          display: none;
      }
    }
    .home__item:nth-child(2) {
      margin: 0 20px;
    }
    
    /*<!--Menu-Burger-->*/
    .button {
      position: relative;
      flex-direction: column;
      align-self: center;
      width: 2rem;
      cursor: pointer;
      transition: all 0.5s ease-in-out;
    }
    
    .button__burger,
    .button__burger::before,
    .button__burger::after {
      width: 100%;
      height: 5px;
      background-color: #fff;
      border-radius: 5px;
      transition: all 0.5s ease-in-out;
    }
    .button__burger::before,
    .button__burger::after {
      content: "";
      position: absolute;
    }
    .button__burger::before {
      transform: translateY(-10px);
    }
    .button__burger::after {
      transform: translateY(10px);
    }
    
    /* Magic */
    .button.open .button__burger {
      transform: translateX(-50px);
      background: transparent;
    }
    
    .button.open .button__burger::before {
      transform: rotate(45deg) translate(35px, -35px);
    }
    .button.open .button__burger::after {
      transform: rotate(-45deg) translate(35px, 35px);
    }
    
    /*<!--Sub-Menu-->*/
    .nav {
      position: fixed;
      width: 100%;
      height: 100%;
      flex-direction: column;
      font-size: 40px;
      margin-top: 5rem;
      opacity: 0.9;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: hidden;
      transform: translateX(-414px);
      transition: all 0.5s ease-in-out;
    }
    .nav.center {
      transform: translateX(0px);
      visibility: inherit;
      background-color: hsla(198,85%,23%,.9);
    }
    .nav.center .nav__item {
      display: inherit;
      margin-top: 1.5rem;
      text-align: center;
    }

    @media (min-width: 768px) {
      .nav.center {
        display: none;
      }
    }
    .nav > a:nth-child(2) {
      margin: 20px 0;
    }
    .nav > a {
      text-shadow: 1px 1px 4px #022534;
      color: #fff;
      text-decoration: none;
      cursor: pointer;
    }`;

    if (this.isAuth == "true") {
      this.shadow.innerHTML = `
        <!--Menu-Burger-->
        <ul class="cont-nav-menu">
            <div class="home__menu-items">
                <li class="home__item"><a href="/mis-datos">Mis datos</a></li>
                <li class="home__item"><a href="/mis-mascotas">Mis mascotas reportadas</a></li>
                <li class="home__item"><a href="/reportar">Reportar mascota</a></li>
                <li class="home__item" style="margin-left: 20px;"><a href="/">Inicio</a></li>
            </div>
        </ul>

        <div class="button center">
            <div class="button__burger"></div>
        </div>

        <!--Sub-Menu-->
        <div class="nav">
            <a class="nav__item" href="/">Inicio</a>
            <a class="nav__item" href="/mis-datos">Mis datos</a>
            <a class="nav__item" href="/mis-mascotas">Mis mascotas reportadas</a>
            <a class="nav__item" href="/reportar">Reportar mascota</a>
        </div>`;
    } else {
      this.shadow.innerHTML = `
        <!--Menu-Burger-->
        <ul class="cont-nav-menu">
            <div class="home__menu-items">
                <li class="home__item"><a href="/login">Iniciar Sesion</a></li>
                <li class="home__item"><a href="/login">Crear Cuenta</a></li>
                <li class="home__item"><a href="/">Inicio</a></li>
            </div>
        </ul>

        <div class="button center">
            <div class="button__burger"></div>
        </div>

        <!--Sub-Menu-->
        <div class="nav">
            <a class="nav__item" href="/">Inicio</a>
            <a class="nav__item" href="/login">Iniciar Sesion</a>
            <a class="nav__item" href="/login">Crear Cuenta</a>
        </div>`;
    }

    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("my-menu", Menu);
