import { useState } from "react";
import { useMutation } from "react-query";
import { API } from "../config/Api";
import { alertRegisterSucces, alertRegisterFailed } from "./alert/Alert";

function Register() {
  // message when login is success or failed
  const [message, setMessage] = useState(null);

  const [valueRegister, setValueRegister] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const { fullName, email, password, phone, address } = valueRegister;

  const handleOnChangeRegister = (e) => {
    setValueRegister({
      ...valueRegister,
      [e.target.name]: e.target.value,
    });
  };

  // strore data as object
  const formData = new FormData()
  formData.set('fullName', valueRegister.fullName)
  formData.set('email', valueRegister.email)
  formData.set('password', valueRegister.password)
  formData.set('phone', Number(valueRegister.phone))
  formData.set('address', valueRegister.address)

  // insert data using useMutation
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      console.log(formData)
      const response = await API.post("/register", formData);
      console.log("register succes : ")
      console.table(response.data.data);

      setMessage(alertRegisterSucces);

      setValueRegister({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
      
    } catch (error) {
      setMessage(alertRegisterFailed);
      console.log("register failed : ", error);
    }
  });

  return (
    <div>
      <label
        htmlFor="my-modal-5"
        className="btn bg-white border-none text-red-700 hover:bg-red-700 hover:text-white"
      >
        Register
      </label>

      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <label htmlFor="my-modal-5" className="modal cursor-pointer">
        <label
          className="modal-box relative bg-white text-black max-w-xs"
          htmlFor=""
        >
          <h1 className="font-bold text-3xl mb-8 text-gray-800">Register</h1>

          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            <input
              onChange={handleOnChangeRegister}
              name="fullName"
              value={fullName}
              style={{ backgroundColor: "#D2D2D240" }}
              type="text"
              placeholder="Full Name"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
            />
            <input
              onChange={handleOnChangeRegister}
              name="email"
              value={email}
              style={{ backgroundColor: "#D2D2D240" }}
              type="email"
              placeholder="Email"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
            />
            <input
              onChange={handleOnChangeRegister}
              name="password"
              value={password}
              style={{ backgroundColor: "#D2D2D240" }}
              type="password"
              placeholder="Password"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
            />
            <input
              onChange={handleOnChangeRegister}
              name="phone"
              value={phone}
              style={{ backgroundColor: "#D2D2D240" }}
              type="number"
              placeholder="Phone"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
            />
            <input
              onChange={handleOnChangeRegister}
              name="address"
              value={address}
              style={{ backgroundColor: "#D2D2D240" }}
              type="text"
              placeholder="Address"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-5"
            />

            {message && message}

            <button
              type="submit"
              className="bg-red-700 btn w-full text-white font-bold border-none"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-2">
            Already have an account ? Click{" "}
            <a href="" className="font-semibold">
              Here
            </a>
          </p>

        </label>
      </label>
    </div>
  );
}

export default Register;
