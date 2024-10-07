import { useContext } from "react";
import { FirestoreContext } from "@/context/FirestoreContext";

const useFirestore = () => {
  return useContext(FirestoreContext);
};

export default useFirestore;
