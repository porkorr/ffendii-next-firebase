const authError = (error) => {
  switch (error.code) {
    case "auth/invalid-email":
      return { message: "Invalid email address.", field: "email" };
    case "auth/user-disabled":
      return { message: "User account is disabled.", field: "email" };
    case "auth/user-not-found":
      return { message: "Email not found.", field: "email" };
    case "auth/wrong-password":
      return { message: "Incorrect password.", field: "password" };
    case "auth/too-many-requests":
      return { message: "Too many requests. Please try again later.", field: "email" };
    case "auth/email-already-in-use":
      return { message: "This email address is already in use.", field: "email" };
    case "auth/operation-not-allowed":
      return { message: "This operation is not allowed.", field: "email" };
    case "auth/weak-password":
      return { message: "The password is too weak.", field: "password" };
    case "auth/credential-already-in-use":
      return { message: "This credential is already associated with another account.", field: "email" };
    case "auth/account-exists-with-different-credential":
      return {
        message: "An account already exists with the same email address but different sign-in credentials.",
        field: "email",
      };
    case "auth/user-token-expired":
      return { message: "Your session has expired. Please log in again.", field: "email" };
    case "auth/invalid-credential":
      return { message: "The provided credential is invalid.", field: "email" };
    case "auth/popup-closed-by-user":
      return { message: "The popup was closed before completing the sign-in.", field: "email" };
    case "auth/popup-blocked":
      return { message: "The popup was blocked by the browser.", field: "email" };
    default:
      return { message: "An unknown error occurred.", field: "email" };
  }
};

export default authError;
