export const rulesDisplayName = [
  {
    pattern: /^[a-zA-Zก-๙0-9-_]+$/,
    message: "Only letters, numbers, hyphens (-), and underscores (_) are allowed",
  },
  {
    required: true,
    message: "Please enter your display name",
  },
  {
    min: 2,
    max: 20,
    message: "Display name must be between 2 and 20 characters",
  },
];

export const rulesEmail = [
  {
    type: "email",
    message: "Please enter a valid email address",
  },
  {
    required: true,
    message: "Please enter your email",
  },
];

export const rulesPassword = [
  {
    required: true,
    message: "Please enter your password",
  },
  {
    min: 8,
    max: 20,
    message: "Password must be between 8 and 20 characters long",
  },
];

export const rulesConfirmPassword = [
  {
    required: true,
    message: "Please confirm your password",
  },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The passwords you entered do not match"));
    },
  }),
];

export const rulesTitleSong = [
  {
    required: true,
    message: "Please enter your song name",
  },
];
