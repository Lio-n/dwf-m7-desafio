import { setPetsOnMap } from "./lib/mapbox";

const API_BASE_URL = "http://localhost:3000";
let i = 0;
type Pet = {
  full_name: string;
  pictureUrl: string;
  breed: string;
  color: string;
  gender: string;
  date_last_seen: string;
  last_location_lat: number;
  last_location_lng: number;
  id?: number;
};

const state = {
  data: {
    email: undefined,
    full_name: undefined,
    TOKEN: undefined,
    currentPosition: {
      lng: undefined,
      lat: undefined,
    },
    pet: {
      full_name: undefined,
      pictureUrl: undefined,
      breed: undefined,
      color: undefined,
      gender: undefined,
      date_last_seen: undefined,
      last_location_lat: undefined,
      last_location_lng: undefined,
    },
  },

  listeners: [],
  init() {
    // Get the local data
    const localData = JSON.parse(localStorage.getItem("saved-state"));
    // If localdata retuns "null", do nothing
    if (!localData) {
      return;
    } else {
      this.setState(localData);
    }
  },

  getState() {
    return this.data;
  },

  showAllLostPets(map: HTMLElement) {
    setPetsOnMap(map);
  },

  async getAllPets() {
    const res = await (
      await fetch(`${API_BASE_URL}/pet`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": " *",
        },
      })
    ).json();

    return res;
  },
  // # Check If User Exists : Return Boolean
  async checkUser(email: string): Promise<boolean> {
    this.setState({ ...this.getState(), email });

    return await (await fetch(`${API_BASE_URL}/exists/${email}`)).json();
  },

  // # Creater User : Return Boolean
  createUser(password: string): void {
    const { email, full_name } = this.getState();

    fetch(`${API_BASE_URL}/auth`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, full_name, password }),
    });
  },

  // # Auth User : Return TOKEN
  async authUser(password: string): Promise<boolean> {
    const { email } = this.getState();

    const res = await (
      await fetch(`${API_BASE_URL}/auth/token`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
    ).json();

    if (res.isToken)
      this.setState({ ...this.getState(), TOKEN: res.isToken, full_name: res.full_name });

    return res.isToken;
  },

  // ! Below here you need a TOKEN

  // # Publish Pet
  async publishPet(pet: Pet) {
    const { TOKEN } = this.getState();

    await fetch(`${API_BASE_URL}/pet/publish`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": " *",
        Authorization: `bearer ${TOKEN}`,
      },
      body: JSON.stringify(pet),
    });
  },

  // # User's Pets
  async getPets() {
    const { TOKEN } = this.getState();

    const res = await (
      await fetch(`${API_BASE_URL}/pet/published-by`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": " *",
          Authorization: `bearer ${TOKEN}`,
        },
      })
    ).json();

    return res;
  },

  // # Get One Pet
  async getOnePet(petId: number) {
    const { TOKEN } = this.getState();

    const res = await (
      await fetch(`${API_BASE_URL}/pet/${petId}`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": " *",
          Authorization: `bearer ${TOKEN}`,
        },
      })
    ).json();

    this.setState({ ...this.getState(), pet: res });
  },

  // # Update One Pet
  async updatePet(pet: Pet) {
    const { TOKEN } = this.getState();

    await fetch(`${API_BASE_URL}/pet/${pet.id}/update`, {
      method: "put",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": " *",
        Authorization: `bearer ${TOKEN}`,
      },
      body: JSON.stringify(pet),
    });
  },

  // # Delete One Pet
  async deletePet(petId: number) {
    const { TOKEN } = this.getState();

    await fetch(`${API_BASE_URL}/pet/${petId}/delete`, {
      method: "delete",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": " *",
        Authorization: `bearer ${TOKEN}`,
      },
    });
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    // localStorage.setItem("saved-state", JSON.stringify(newState));

    console.log("soy el state, he cambiado", i++, this.data);
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};
export { state };
