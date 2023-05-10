import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useMutation } from "react-query";
import { API } from "../config/Api";
import { alertRaiseFundSucces, alertRaiseFundFailed } from "./alert/Alert";

function FormFund() {
  const navigate = useNavigate();
  // message when raisefund is success or failed
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(null)

  const [form, setForm] = useState({
    title: "",
    thumbnail: "",
    goal: "",
    description: "",
  });

  const { title, goal, description } = form;

  const handleOnChangeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'file' ? e.target.files : e.target.value,
    })
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0])
      setPreview(url)
  }
  };

  // insert data using useMutation
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      // strore data as object
      const formData = new FormData();
      formData.set("title", form.title);
      formData.set("thumbnail", form.thumbnail[0], form.thumbnail[0].name);
      formData.set("goal", form.goal);
      formData.set("description", form.description);
      console.log(formData);

      const response = await API.post("/donation", formData, config);
      console.log("Raise Fund succes : ");
      console.table(response.data.data);

      setMessage(alertRaiseFundSucces)

      setForm({
        title: "",
        thumbnail: "",
        goal: "",
        description: "",
      });

      navigate("/raise-fund")

    } catch (error) {
      setMessage(alertRaiseFundFailed)
      console.log("Raise Fund failed : ", error);
    }
  });

  const fileInputRefAttach = useRef(null)

  const handleClickAttach = () => {
    fileInputRefAttach.current.click()
  }

  return (
    <div className="w-full h-[700px]" style={{ backgroundColor: "#E5E5E5" }}>
      <div className="w-full p-4 pt-8 md:w-[800px] md:mx-auto">
        <h1 className="text-black text-2xl font-bold mb-4">Make Raise Fund</h1>
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleOnChangeForm}
            placeholder="Title"
            className="input input-bordered w-full bg-white mb-3"
          />
          
          {preview && (
            <img className="w-1/2 rounded-md md:w-[200px] mb-3" src={preview} alt="" />
          )}

          <input
            type="file"
            name="thumbnail"
            onChange={handleOnChangeForm}
            ref={fileInputRefAttach}
            hidden
            style={{ background: "rgba(210, 210, 210, 0.25)" }}
            className="p-2 mb-3 rounded-[3px] border-white border-[1px] text-white"
          />
          <div onClick={handleClickAttach} className="mb-3 cursor-pointer">
            <h1 className="bg-red-700 p-2 rounded-md text-white font-semibold w-1/2 md:w-[200px] text-center">
              Attache Thumbnail
            </h1>
          </div>
          <input
            type="number"
            name="goal"
            value={goal}
            onChange={handleOnChangeForm}
            placeholder="Goals Donation"
            className="input input-bordered w-full bg-white mb-3"
          />
          <textarea
            type="textarea"
            name="description"
            value={description}
            onChange={handleOnChangeForm}
            className="textarea textarea-bordered textarea-lg bg-white w-full text-base h-[150px]"
            placeholder="Description"
          ></textarea>

          {message && message}

          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-red-700 p-2 rounded-md text-white font-semibold md:w-[400px] text-center md:ml-[50%]">
              Public Fundraising
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormFund;
