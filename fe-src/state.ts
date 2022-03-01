import { setPetsOnMap } from "./lib/mapbox";

const API_BASE_URL = "http://localhost:3000";
let i = 0;

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
      sex: undefined,
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

  // # Send Report
  async sendReport(report_data): Promise<boolean> {
    return await (
      await fetch(`${API_BASE_URL}/report/pet`, {
        method: "post",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": " *",
        },
        body: JSON.stringify(report_data),
      })
    ).json();
  },

  showAllLostPets(map: HTMLElement): void {
    setPetsOnMap(map);
  },

  async getAllPets(): Promise<object> {
    return await (
      await fetch(`${API_BASE_URL}/pet`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": " *",
        },
      })
    ).json();
  },

  async getPetsNearby(lat, lng): Promise<object> {
    return await (
      await fetch(`${API_BASE_URL}/pets-nearby?lat=${lat}&lng=${lng}`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": " *",
        },
      })
    ).json();
  },

  // # Check If User Exists : Return Boolean
  async checkUser(email: string): Promise<boolean> {
    this.setState({ ...this.getState(), email });

    return await (await fetch(`${API_BASE_URL}/exists/${email}`)).json();
  },

  // # Creater User : Return Boolean
  async createUser(password: string): Promise<void> {
    const { email, full_name } = this.getState();

    await fetch(`${API_BASE_URL}/auth`, {
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

  // # User's Email : Return string
  async getUserEmail(published_by: number): Promise<string> {
    return await (
      await fetch(`${API_BASE_URL}/user/${published_by}`, {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      })
    ).json();
  },

  // ! Below here you need a TOKEN

  // # Publish Pet
  async publishPet(pet): Promise<void> {
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
  async getPets(): Promise<object> {
    const { TOKEN } = this.getState();

    return await (
      await fetch(`${API_BASE_URL}/pet/published-by`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": " *",
          Authorization: `bearer ${TOKEN}`,
        },
      })
    ).json();
  },

  // # Get One Pet
  async getOnePet(petId: number): Promise<void> {
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
  async updatePet(pet): Promise<void> {
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
  async deletePet(petId: number): Promise<void> {
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
