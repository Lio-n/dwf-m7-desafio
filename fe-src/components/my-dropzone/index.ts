import Dropzone from "dropzone";
import { state } from "../../state";

const modifyPng = require("../../assets/modify_picture.png");
const addPicture = require("../../assets/add_picture.png");

class Picture extends HTMLElement {
  shadow: ShadowRoot;
  src;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.src = this.getAttribute("src") || "";
    this.render();
  }
  addListener() {
    const addPicture = () => {
      const petPicture: HTMLElement = this.shadow.querySelector(".pet__picture");
      const addPictureImg: HTMLImageElement = petPicture.querySelector(".pet__add-picture");

      const previewTp = document.createElement("div");
      previewTp.innerHTML = `
        <div class="dz-preview dz-file-preview picture__thumbnail" style="max-width: 20rem;">
            <div class="dz-details" style="max-width: 20rem;">
                <img data-dz-thumbnail class="dropzone__picture" style="max-width: 20rem; display: block; border-radius: 10px; min-width: 6rem; max-height: 21rem; min-height: 15rem;"/>
            </div>
            <div class="pet__layer">
                <img class="picture__update" src="${modifyPng}" />
            </div>
        </div>`;

      let currentFile = null;
      const myDropzone = new Dropzone(petPicture, {
        url: "/",
        autoProcessQueue: false,
        previewTemplate: previewTp.innerHTML,
        maxFiles: 1,
        thumbnailWidth: "720",
        thumbnailHeight: "720",
        init: function () {
          this.on("maxfilesexceeded", (file: any) => {
            this.removeAllFiles();
            this.addFile(file);
          });
          this.on("addedfile", function (file) {
            if (currentFile) {
              this.removeFile(currentFile);
            }
            currentFile = file;
          });
        },
      });

      let mockFile = { name: "Update Pet", dataURL: this.src };
      if (this.src !== "") {
        myDropzone.files.push(mockFile);
        myDropzone.emit("addedfile", mockFile);
        myDropzone.createThumbnailFromUrl(
          mockFile,
          myDropzone.options.thumbnailWidth,
          myDropzone.options.thumbnailHeight,
          myDropzone.options.thumbnailMethod,
          true,
          (thumbnail) => {
            myDropzone.emit("thumbnail", mockFile, thumbnail);
          }
        );
        myDropzone.emit("complete", mockFile);
      }

      myDropzone.on("thumbnail", (file) => {
        addPictureImg.style.display = "none";

        // $ Set pictureUrl.
        const { pet } = state.getState();
        pet.pictureUrl = file.dataURL;

        state.setState({ ...state.getState(), pet });
      });
    };

    addPicture();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root {
        min-height: 22rem;
    }
    .centerFlex, .picture__thumbnail, .previewTp__update, .pet__picture, .pet__layer, .root {
        /* box model */
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .picture__thumbnail {
        max-height: 22rem;
        /* positioning */
        position: relative;
        z-index: -2;
    }
    .previewTp__update {
        /* box model */
        height: 100%;
        width: 100%;
        /* positioning */
        position: absolute;
        /* typography */
        font-size: 1.5rem;
    }
    .pet__picture {
        /* box model */
        max-width: max-content;
        padding: .5rem;
        cursor: pointer;
        margin: 0 auto;
        /* positioning */
        position: relative;
    }
    .pet__add-picture, .picture__update {
        width: 48px;
        height: 48px;
    } 
    .pet__add-picture {
        z-index: -2;
    }
    .pet__layer {
        /* box model */
        position: absolute;
        width: 100%;
        height: 100%;
        /* visual */
        opacity: 0;
        border-radius: 10px;
        transition: all .3s ease-in-out;
      }
      .pet__picture:hover .pet__layer {
        opacity: 1;
      }
      .pet__picture:hover .dropzone__picture {
        filter: blur(1px);
      }`;

    this.shadow.innerHTML = `
    <div class="root">
        <div class="pet__picture">
            <img class="pet__add-picture" src="${addPicture}" />
        </div>
    </div>`;

    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("my-dropzone", Picture);
