import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import "./Login.css";
import loadingGif from "../../assets/Loader.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className={`app-container w-full ${isPending ? 'blurred' : ''}`}>
      <form className="bg-white rounded-xl  p-10 mx-auto w-[700px] " onSubmit={handleSubmit}>
        <div className="text-3xl font-bold">SIGN IN AS ADMIN</div>
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

        


        {!isPending && <button className="btn">LOG IN</button>}
        
        {error && <div className="error">{error}</div>}
        {/* <div className="create-link"> <a href="/signup">Create Admin Account</a></div> */}
      </form>
      
      {isPending && (
        <div className="loading-modal">
          <img src={loadingGif} alt="Loading" className="loading-gif" />
        </div>
      )}

    
    </div>
  );
}
