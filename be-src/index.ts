import "dotenv/config";

import * as path from "path";
// # Middleware
import {
  userMiddleware,
  authMiddleware,
  tokenMiddleware,
  petMiddleware,
  reportMiddleware,
} from "./models/middleware";

// # Controllers
import {
  existsUser,
  createUser,
  updateProfile,
  getUserFullname,
  getUserEmail,
} from "./controllers/users-controller";
import { authUser } from "./controllers/auth-controller";
import {
  publishPet,
  getUserPets,
  getOnePet,
  updatePet,
  getAllPets,
  deletePet,
  getPetsNearby,
} from "./controllers/pets-controller";

import { setReport } from "./controllers/reports-controller";

import * as express from "express";
import * as cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "75mb" }));
app.use(express.static("dist"));

const port: number = 3000;

// ## ヾ(●ω●)ノ ##

// $ Verificate If User Exists.
app.get("/exists/:email", async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) throw "All inputs are required";

    const exists = await existsUser(email);
    res.status(200).json(exists);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Signup : Creater User
app.post("/auth", userMiddleware, async (req, res) => {
  try {
    const userCreated = await createUser(req._user);
    // if userCreated == True;
    // * Then es por que crea su Cuenta por primera vez.
    // Else userCreated == False;
    // * Then la Cuenta ya existe, y se desea actualizar un recurso.

    if (!userCreated.isCreated) {
      const isUpdated: boolean = await updateProfile(userCreated.id, req._user);
      res.status(200).json(isUpdated);
    } else {
      res.status(201).json(userCreated);
    }
  } catch (err) {
    res.status(409).json(err);
  }
});

// $ Signin : 'Iniciar Sesion' de nuevo. Dan un TOKEN.
// * Basicamente, guardo el TOKEN con el id del User en el 'localStorage'.
// * Así p. ej., actualizar Reportar Mascota, enviaria el TOKEN y los datos a actualizar.
app.post("/auth/token", authMiddleware, async (req, res) => {
  try {
    const isToken: boolean = await authUser(req._user);

    if (isToken) {
      const full_name = await getUserFullname(req._user.email);
      res.status(200).json({ isToken, full_name });
    } else {
      res.status(200).json(isToken);
    }
  } catch (err) {
    res.status(401).json(err);
  }
});

// $ Get All Pets
app.get("/pet", async (req, res) => {
  try {
    const allPets: object = await getAllPets();

    res.status(201).json(allPets);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Set Report.
app.post("/report/pet", reportMiddleware, async (req, res) => {
  try {
    const owner_email = await getUserEmail(req._report.published_by);

    const isReported = await setReport(req._report, owner_email);

    res.status(200).json(isReported);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Get Pets Nearby.
app.get("/pets-nearby", async (req, res) => {
  const { lat, lng } = req.query;

  try {
    if (!lat && !lng) {
      res.status(400).json({ message: "All inputs are required" });
    } else {
      const hits = await getPetsNearby(lat, lng);

      res.status(200).json(hits);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// ! Below here need a TOKEN : Authorization: `bearer ${TOKEN}`

// $ Publish Pet
app.post("/pet/publish", tokenMiddleware, petMiddleware, async (req, res) => {
  try {
    const isCreated: boolean = await publishPet(req._pet, req._userId);

    res.status(201).json(isCreated);
  } catch (err) {
    res.status(401).json(err);
  }
});

// $ Get All the User's Pets
app.get("/pet/published-by", tokenMiddleware, async (req, res) => {
  try {
    const userPets: object = await getUserPets(req._userId);

    res.status(201).json(userPets);
  } catch (err) {
    res.status(401).json(err);
  }
});

// $ Get One Pet
app.get("/pet/:petId", tokenMiddleware, async (req, res) => {
  try {
    const onePet: object = await getOnePet(req._userId, req.params.petId);

    res.status(200).json(onePet);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Update One Pet
app.put("/pet/:petId/update", tokenMiddleware, petMiddleware, async (req, res) => {
  try {
    const isUpdated: boolean = await updatePet(req._userId, req.params.petId, req._pet);

    res.status(200).json(isUpdated);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Delete One Pet
app.delete("/pet/:petId/delete", tokenMiddleware, async (req, res) => {
  try {
    const isDeleted: boolean = await deletePet(req._userId, req.params.petId);

    res.status(200).json(isDeleted);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.table({ message: "Server listen on port", port });
});
