import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { API, setAuthToken } from "../config/Api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { alertLoginSucces, alertLoginFailed } from "../components/alert/Alert";

function Login() {
  const [, dispatch] = useContext(UserContext);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate()

  const [valueLogin, setValueLogin] = useState({
    email: "",
    password: "",
  });

  const { email, password } = valueLogin;

  const handleOnChangeLogin = (e) => {
    setValueLogin({
      ...valueLogin,
      [e.target.name]: e.target.value,
    });
  };

  // insert data using useMutation
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const response = await API.post("/login", valueLogin);
      console.log("login succes : ");
      console.table(response.data.data);

      // send data to useContext
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.data,
      })

      // set authorization token header
      setAuthToken(localStorage.token)

      setValueLogin({
        email: "",
        password: "",
      });
      
      setMessage(alertLoginSucces);
      redirectPage()

    } catch (error) {
      setMessage(alertLoginFailed);
      console.log("login failed : ", error);
    }
  });

  function redirectPage() {
    const timeoutId = setTimeout(() => {
      navigate("/profile")
    }, 2000)
    return () => clearTimeout(timeoutId)
  }

  return (
    <div>
      <label
        htmlFor="my-modal-4"
        className="btn bg-transparent border-none text-white hover:bg-white hover:text-red-700 mr-4"
      >
        Login
      </label>

      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label
          className="modal-box relative bg-white text-black max-w-xs"
          htmlFor=""
        >
          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            <h1 className="font-bold text-3xl mb-8 text-gray-800">Login</h1>
            <input
              onChange={handleOnChangeLogin}
              name="email"
              value={email}
              style={{ backgroundColor: "#D2D2D240" }}
              type="email"
              placeholder="Email"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
            />
            <input
              onChange={handleOnChangeLogin}
              name="password"
              value={password}
              style={{ backgroundColor: "#D2D2D240" }}
              type="password"
              placeholder="Password"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-5"
            />
            {message && message}
            <button
              type="submit"
              className="bg-red-700 btn w-full text-white font-bold border-none"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-2">
            Don&#39;t have an account ? Click{" "}
            <a href="" className="font-semibold">
              Here
            </a>
          </p>
        </label>
      </label>
    </div>
  );
}

export default Login;
