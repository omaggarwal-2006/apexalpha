import toast from "react-hot-toast";

/**
 * Centralized Error Handler for the Apex Alpha platform
 */
export const handleFirebaseError = (error, context = "") => {
  console.error(`[Firebase Error] ${context}:`, error);
  
  let message = "An unexpected security breach occurred.";
  
  if (error.code) {
    switch (error.code) {
      case "auth/user-not-found":
        message = "Identity not found in Sovereign database.";
        break;
      case "auth/wrong-password":
        message = "Cipher mismatch. Access denied.";
        break;
      case "permission-denied":
        message = "Security Protocol: Permission Denied.";
        break;
      case "resource-exhausted":
        message = "System overload. Please try again later.";
        break;
      default:
        message = error.message.replace("Firebase: ", "");
    }
  }

  toast.error(`${message}`, {
    id: "error-toast",
    duration: 5000,
  });

  return message;
};

export const handleNetworkError = (error) => {
  console.error("[Network Error]:", error);
  toast.error("Connectivity Lost: Attempting Re-sync...");
};
