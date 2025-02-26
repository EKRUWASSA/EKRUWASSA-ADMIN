import { useState, useEffect } from "react";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    console.log("Starting signup process...");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Display Name:", displayName);
    console.log("Thumbnail:", thumbnail);

    try {
      // Signup
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("User created:", res);

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // Upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      console.log("Upload path:", uploadPath);

      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      console.log("Thumbnail uploaded:", img);

      const imgURL = await img.ref.getDownloadURL();
      console.log("Thumbnail URL:", imgURL);

      // Add display name to user
      await res.user.updateProfile({ displayName, photoURL: imgURL });
      console.log("User profile updated:", {
        displayName,
        photoURL: imgURL,
      });

      // Create user document
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgURL,
      });
      console.log("User document created in Firestore");

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });
      console.log("User logged in:", res.user);

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      console.error("Error during signup:", err.message);
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
