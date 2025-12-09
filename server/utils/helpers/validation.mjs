export const signupValidation = {
  username: {
    exists: { errorMessage: "Username is required" },
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    isLength: {
      options: {
        min: 3,
        max: 20,
      },
      errorMessage: "Must be at least 3-20 characters",
    },
    stripLow: true,
    trim: true,
  },
  email: {
    exists: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid email" },
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    normalizeEmail: true,
    trim: true,
  },
  password: {
    exists: { errorMessage: "Password is required" },
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    isLength: {
      options: { min: 6 },
      errorMessage: "Must be at least 6 characters",
    },
    matches: {
      options: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      errorMessage: "Password must contain at least one letter and one number",
    },
    trim: true,
    stripLow: true,
  },
};

export const postValidation = {
  title: {
    exists: { errorMessage: "Title is required" },
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    isLength: {
      options: {
        min: 3,
        max: 100,
      },
      errorMessage: "Must be at least 3-100 characters",
    },
    trim: true,
  },
  description: {
    exists: { errorMessage: "Content is required" },
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    trim: true,
  },
  category: {
    optional: true,
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    trim: true,
  },
  tags: {
    optional: true,
    isArray: { errorMessage: "Tags must be an array" },
  },
  "tags.*": {
    optional: true,
    isString: { errorMessage: "Must be a string" },
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
      errorMessage: "Each tag must be 1-20 characters",
    },
    trim: true,
  },
};

export const userPatch = {
  username: {
    optional: true,
    bail: true,
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    isLength: {
      options: {
        min: 3,
        max: 20,
      },
      errorMessage: "Must be at least 3-20 characters",
    },
    stripLow: true,
    trim: true,
  },
  email: {
    optional: true,
    bail: true,
    isEmail: { errorMessage: "Invalid email" },
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    normalizeEmail: true,
    trim: true,
  },
  password: {
    optional: true,
    bail: true,
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    isLength: {
      options: { min: 6 },
      errorMessage: "Must be at least 6 characters",
    },
    matches: {
      options: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      errorMessage: "Password must contain at least one letter and one number",
    },
    trim: true,
    stripLow: true,
  },
   currentPsw: {
    optional: true,
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Current password is required" },
    trim: true,
    stripLow: true,
  },
};

export const postPatch = {
  title: {
    optional: true,
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    isLength: {
      options: {
        min: 3,
        max: 100,
      },
      errorMessage: "Must be at least 3-100 characters",
    },
    trim: true,
  },
  description: {
    optional: true,
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    trim: true,
  },
  category: {
    optional: true,
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    trim: true,
  },
  tags: {
    optional: true,
    isArray: { errorMessage: "Tags must be an array" },
  },
  "tags.*": {
    optional: true,
    isString: { errorMessage: "Must be a string" },
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
      errorMessage: "Each tag must be 1-20 characters",
    },
    trim: true,
  },
};

export const userLogin = {
  email: {
    exists: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid email" },
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not empty" },
    normalizeEmail: true,
    trim: true,
  },
  password: {
    exists: { errorMessage: "Password is required" },
    notEmpty: { errorMessage: "Must be not empty" },
    trim: true,
    stripLow: true,
  },
};
