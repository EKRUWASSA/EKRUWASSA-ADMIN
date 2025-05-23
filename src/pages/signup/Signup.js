import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState("");

  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayname, thumbnail);
  };

  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];

    // check the selected file
    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }

    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    if (selected.size > 3000000) {
      setThumbnailError("Image file size must be less than 3MB");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <label>
        <span>Email:</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </label>
      <label>
        <span>Password:</span>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </label>
      <label>
        <span>Full Name:</span>
        <input
          required
          type="text"
          value={displayname}
          onChange={(e) => setDisplayname(e.target.value)}
        ></input>
      </label>
      <label>
        <span>Profile Picture:</span>
        <input
          required
          type="file"
          accept="image/*"
          capture="camera"
          onChange={handleFileChange}
        ></input>
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">Sign up</button>}
      {isPending && (
        <button className="btn" disabled>
          Loading...
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
