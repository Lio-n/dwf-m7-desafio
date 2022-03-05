import * as jwt from "jsonwebtoken";
const { TOKEN_KEY } = process.env;

// * Comprobate if one Object has the same properties than another.
const checkObjEqual = (obj1, obj2): boolean => {
  for (let key in obj1) {
    if (!(key in obj2)) return false;
  }
  return true;
};

export const userMiddleware = async (req, res, next) => {
  const { full_name, password, email } = req.body;
  try {
    if (full_name && password && email) {
      req._user = { full_name, password, email };

      return next();
    }

    throw "All inputs are required";
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const authMiddleware = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      req._user = { email, password };
      return next();
    }

    throw "All inputs are required";
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const tokenMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) throw "Header Authorization does not exist";

    // * The token is extracted
    const access_token = authorization.split(" ")[1];
    const dataJSON = jwt.verify(access_token, TOKEN_KEY);

    req._userId = dataJSON.id;
    next();
  } catch (err) {
    res.status(401).json({ err });
  }
};

export const petMiddleware = async (req, res, next) => {
  const pet_layer = {
    full_name: undefined,
    pictureUrl: undefined,
    breed: undefined,
    color: undefined,
    sex: undefined,
    date_last_seen: undefined,
    last_location_lat: undefined,
    last_location_lng: undefined,
  };

  try {
    let isEqual: boolean = checkObjEqual(pet_layer, req.body);

    if (isEqual) {
      // * Set the properties of one object to another.
      req._pet = { ...req.body };

      return next();
    }

    throw "All inputs are required";
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const reportMiddleware = async (req, res, next) => {
  const report_layer = {
    full_name: undefined,
    phone_number: undefined,
    message: undefined,
    pet_id: undefined,
    published_by: undefined,
    pet_name:undefined
  };

  try {
    let isEqual: boolean = checkObjEqual(report_layer, req.body);
    if (isEqual) {
      // * Set the properties of one object to another.
      req._report = { ...req.body };

      return next();
    }

    throw "All inputs are required";
  } catch (err) {
    res.status(400).json({ err });
  }
};
