import "dotenv/config";

// # Middleware
import {
  userMiddleware,
  authMiddleware,
  tokenMiddleware,
  petMiddleware,
} from "./models/middleware";

// # Controllers
import {
  existsUser,
  createUser,
  updateProfile,
  getUserFullname,
} from "./controllers/users-controller";
import { authUser } from "./controllers/auth-controller";
import {
  publishPet,
  getUserPets,
  getOnePet,
  updatePet,
  getAllPets,
  deletePet,
} from "./controllers/pets-controller";

import * as express from "express";
import * as cors from "cors";

const app = express();

app.use(express.json({ limit: "75mb" }));
app.use(cors());

const port: number = 3000;

// ## ヾ(●ω●)ノ ##

// $ Verificate If User Exists.
// ? Should : Use '/exists?user=${email}'
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
    res.status(409).json({ errBo: true, err: err });
  }
});

// $ Signin : 'Iniciar Sesion' de nuevo. Dan un TOKEN.
// * Basicamente, guardo el TOKEN con el id del User en el 'localStorage'.
// * Así p. ej., actualizar Reportar Mascota, enviaria el TOKEN y los datos a actualizar.
app.post("/auth/token", authMiddleware, async (req, res) => {
  try {
    const isToken: boolean = await authUser(req._user);

    if (isToken) {
      const full_name: string = await getUserFullname(req._user.email);
      res.status(200).json({ isToken, full_name });
    } else {
      res.status(200).json({ isToken });
    }
  } catch (err) {
    res.status(401).json({ err });
  }
});

// ! Below here need a TOKEN

// $ Get All Pets
// * /pet
app.get("/pet", async (req, res) => {
  try {
    const allPets: object = await getAllPets();

    res.status(201).json(allPets);
  } catch (err) {
    res.status(401).json({ err });
  }
});

// $ Publish Pet
// * /pet/publish
// Authorization: `bearer ${TOKEN}`
app.post("/pet/publish", tokenMiddleware, petMiddleware, async (req, res) => {
  try {
    const isCreated: boolean = await publishPet(req._pet, req._userId);

    res.status(201).json(isCreated);
  } catch (err) {
    res.status(401).json({ err });
  }
});

// $ Get All the User's Pets
// * /pet/published-by
// Authorization: `bearer ${TOKEN}`
app.get("/pet/published-by", tokenMiddleware, async (req, res) => {
  try {
    const userPets: object = await getUserPets(req._userId);

    res.status(201).json(userPets);
  } catch (err) {
    res.status(401).json({ err });
  }
});

// $ Get One Pet
// * /pet/{id}
// Authorization: `bearer ${TOKEN}`
app.get("/pet/:petId", tokenMiddleware, async (req, res) => {
  try {
    const onePet: object = await getOnePet(req._userId, req.params.petId);

    res.status(200).json(onePet);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Update One Pet
// * /pet/{id}/update
// Authorization: `bearer ${TOKEN}`
app.put("/pet/:petId/update", tokenMiddleware, petMiddleware, async (req, res) => {
  try {
    const isUpdated: boolean = await updatePet(req._userId, req.params.petId, req._pet);

    res.status(200).json(isUpdated);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Delete One Pet
// * /pet/{id}/delete
// Authorization: `bearer ${TOKEN}`
app.delete("/pet/:petId/delete", tokenMiddleware, async (req, res) => {
  try {
    const isDeleted: boolean = await deletePet(req._userId, req.params.petId);

    res.status(200).json(isDeleted);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.listen(port, () => {
  console.table({ message: "Server listen on port", port });
});
