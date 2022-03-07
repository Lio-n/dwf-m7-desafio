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
  updateUser,
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
app.use(express.static("fe-dist"));

const port = process.env.PORT || 3000;

// ## ヾ(●ω●)ノ ##

// $ Verificate If User Exists.
app.get("/exists/:email", async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) throw "All inputs are required";

    const exists: boolean = await existsUser(email);
    res.status(200).json(exists);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Signup : Creater User.
app.post("/auth", userMiddleware, async (req, res) => {
  try {
    const isCreated: boolean = await createUser(req._user);

    res.status(201).json(isCreated);
  } catch (err) {
    res.status(409).json(err);
  }
});

// $ Signin : Generate TOKEN.
app.post("/auth/token", authMiddleware, async (req, res) => {
  try {
    const isToken: boolean = await authUser(req._user);

    if (isToken) {
      const full_name: string = await getUserFullname(req._user.email);
      res.status(200).json({ isToken, full_name });
    } else {
      res.status(200).json(isToken);
    }
  } catch (err) {
    res.status(401).json(err);
  }
});

// $ Get All Pets.
app.get("/pet", async (req, res) => {
  try {
    const allPets: object[] = await getAllPets();

    res.status(201).json(allPets);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Set Report.
app.post("/report/pet", reportMiddleware, async (req, res) => {
  try {
    const owner_email: string = await getUserEmail(req._report.published_by);

    const isReported: boolean = await setReport(req._report, owner_email);

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
      const hits: object[] = await getPetsNearby(lat, lng);

      res.status(200).json(hits);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// ! Below here need a TOKEN : Authorization: `bearer ${TOKEN}`

// $ Update User.
app.put("/user/update", tokenMiddleware, async (req, res) => {
  try {
    const { full_name, password } = req.body;

    if (!full_name && !password) throw "All inputs are required";

    const isUpdated: boolean = await updateUser(req._userId, req.body);
    res.status(204).json(isUpdated);
  } catch (err) {
    res.status(409).json(err);
  }
});

// $ Publish Pet.
app.post("/pet/publish", tokenMiddleware, petMiddleware, async (req, res) => {
  try {
    const isCreated: boolean = await publishPet(req._pet, req._userId);

    res.status(201).json(isCreated);
  } catch (err) {
    res.status(401).json(err);
  }
});

// $ Get All the User's Pets.
app.get("/pet/published-by", tokenMiddleware, async (req, res) => {
  try {
    const userPets: object[] = await getUserPets(req._userId);

    res.status(201).json(userPets);
  } catch (err) {
    res.status(401).json(err);
  }
});

// $ Get One Pet.
app.get("/pet/:petId", tokenMiddleware, async (req, res) => {
  try {
    const onePet: object = await getOnePet(req._userId, req.params.petId);

    res.status(200).json(onePet);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Update One Pet.
app.put("/pet/:petId/update", tokenMiddleware, petMiddleware, async (req, res) => {
  try {
    const isUpdated: boolean = await updatePet(req._userId, req.params.petId, req._pet);

    res.status(200).json(isUpdated);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $ Delete One Pet.
app.delete("/pet/:petId/delete", tokenMiddleware, async (req, res) => {
  try {
    const isDeleted: boolean = await deletePet(req._userId, req.params.petId);

    res.status(200).json(isDeleted);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../fe-dist/index.html"));
});

app.listen(port, () => {
  console.table({ message: "Server listen on port", port });
});
