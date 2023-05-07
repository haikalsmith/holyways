import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../config/Api";
import noImage from "../assets/images/no-image.webp";
import { useEffect, useState } from "react";
// import { UserContext } from "../context/UserContext";

function DetailDonate() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [form, setForm] = useState({
    total: "",
    donation_id: "",
  })

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  let { data: funderbydonation } = useQuery("funderBydonationAndStatusSuccess", async () => {
    const response = await API.get(`/funder-by-donation-and-status-succes/${id}`)
    return response.data.data
  })

  console.table(funderbydonation)


  let { data: detailFund } = useQuery("detailFundCache", async () => {
    const response = await API.get(`/donation/${id}`);
    return response.data.data;
  });

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = import.meta.env.VITE_REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleDonate = useMutation(async (e) => {
    
    try {
      e.preventDefault()

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const data = {
        total: Number(form.total),
        donation_id: Number(id),
      };

      const body = JSON.stringify(data);
      console.log(body);

      const response = await API.post('/funder', body, config);
      console.log("donation success :", response)

      const token = response.data.data.token;

      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log("donation failed : ", error);
    }
  });

  return (
    <div className="" style={{ backgroundColor: "#E5E5E5" }}>
      <div className="w-[800px] mx-auto pt-10 flex mb-5 justify-between">
        <div className="w-[40%] overflow-hidden object-cover mr-10 rounded-md">
          {detailFund?.thumbnail == "" ? (
            <img className="object-cover" src={noImage} alt="" />
          ) : (
            <img className="object-cover" src={detailFund?.thumbnail} alt="" />
          )}
        </div>
        <div className="w-[50%]">
          <h1 className="text-black font-bold text-2xl mb-4">
            {detailFund?.title}
          </h1>
          <div className="flex justify-between mb-2">
            <p className="text-red-700 font-semibold">Rp {detailFund?.current_goal.toLocaleString("id-ID").replace(/,/g, ".")}</p>
            <p className="text-gray-500">gathered from</p>
            <p className="font-semibold" style={{ color: "#616161" }}>
              Rp {detailFund?.goal.toLocaleString("id-ID").replace(/,/g, ".")}
            </p>
          </div>
          <progress
            className="progress progress-error w-full"
            value={detailFund?.current_goal}
            max={detailFund?.goal}
          ></progress>
          <div className="flex justify-between mb-5">
            <div className="flex gap-1 items-center">
              <p className="font-semibold text-black">{funderbydonation?.length}</p>
              <p className="" style={{ color: "#616161" }}>
                Donation
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <p className="font-semibold text-black">150</p>
              <p className="" style={{ color: "#616161" }}>
                More Day
              </p>
            </div>
          </div>
          <div></div>
          <div></div>
          <p className="mb-4 line-clamp-3" style={{ color: "#616161" }}>
            {detailFund?.description}
          </p>

          <label
            htmlFor="my-modal-donate"
            className="btn bg-red-700 w-full text-white font-semibold p-2 rounded-md text-center border-none hover:bg-red-900 hover:text-white mr-4"
          >
            Donate
          </label>

          <input
            type="checkbox"
            id="my-modal-donate"
            className="modal-toggle"
          />
          <label htmlFor="my-modal-donate" className="modal cursor-pointer">
            <label
              className="modal-box relative bg-white text-black max-w-xs"
              htmlFor=""
            >
              <h1 className="font-bold text-2xl mb-2 text-gray-800">Nominal</h1>
              <form onSubmit={(e) => handleDonate.mutate(e)}>
                <input
                  onChange={handleOnChange}
                  name="total"
                  value={form.total}
                  style={{ backgroundColor: "#D2D2D240" }}
                  type="number"
                  placeholder="Nominal Donation"
                  className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
                />

                {/* {message && message} */}

                <button
                  type="submit"
                  className="mt-7 btn bg-red-700 w-full text-white font-semibold p-2 rounded-md text-center border-none hover:bg-red-900 hover:text-white mr-4"
                >
                  Donate
                </button>
              </form>
            </label>
          </label>
        </div>
      </div>
      <div className="w-[800px] mx-auto pb-20">
        <h1 className="text-black font-bold text-2xl mb-3">
          List Donation ({funderbydonation?.length})
        </h1>
        <div>
          {funderbydonation?.map((item) => (
            <div key={item?.id} className="bg-white p-2 mb-3 rounded-md">
              <h1 className="text-black font-semibold">{item?.user.fullName}</h1>
              <h1 className="text-black font-semibold">
                {item?.donate_at}
              </h1>
              <h1 className="text-red-800 font-semibold">Total : Rp {item?.total}</h1>
            </div>
          ))}
          {/* <div className="bg-white p-2 mb-3 rounded-md">
            <h1 className="text-black font-semibold">Andi</h1>
            <h1 className="text-black font-semibold">
              Saturday, 12 April 2021
            </h1>
            <h1 className="text-red-800 font-semibold">Total : Rp 45.000</h1>
          </div>
          <div className="bg-white p-2 mb-3 rounded-md">
            <h1 className="text-black font-semibold">Andi</h1>
            <h1 className="text-black font-semibold">
              Saturday, 12 April 2021
            </h1>
            <h1 className="text-red-800 font-semibold">Total : Rp 45.000</h1>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default DetailDonate;
