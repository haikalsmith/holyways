import { useQuery } from "react-query";
import { API, setAuthToken } from "../config/Api";
import { useState } from "react";

function Profile() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(3);

  let { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get(
      "/user-by-login",
      setAuthToken(localStorage.token)
    );
    return response.data.data;
  });

  useQuery("funderByLoginCache", async () => {
    const response = await API.get(
      "/funder-by-login",
      setAuthToken(localStorage.token)
    );
    setData(response.data.data);
    return response.data.data;
  });

  const loadMore = () => {
    setVisible((prev) => prev + 3);
  };

  return (
    <div className="w-full pb-20" style={{ backgroundColor: "#E5E5E5" }}>
      <div className="flex justify-center pt-10">
        <div className="w-[500px]">
          <h1 className="text-2xl font-bold text-black mb-5">My Profile</h1>
          <div className="flex mb-5">
            <img
              className="w-[200px] mr-5 rounded-md"
              src="https://i.pinimg.com/originals/47/4f/5f/474f5fa00f60fb5c2e47c9dfcd7b1593.jpg"
              alt=""
            />
            <div>
              <div>
                <h1 className="text-red-700 font-semibold">Full Name</h1>
                <h1 className="text-gray-700">{profile?.fullName}</h1>
              </div>
              <div>
                <h1 className="text-red-700 font-semibold">Email</h1>
                <h1 className="text-gray-700">{profile?.email}</h1>
              </div>
              <div>
                <h1 className="text-red-700 font-semibold">Phone</h1>
                <h1 className="text-gray-700">{profile?.phone}</h1>
              </div>
              <div>
                <h1 className="text-red-700 font-semibold">Address</h1>
                <h1 className="text-gray-700">{profile?.address}</h1>
              </div>
            </div>
          </div>
          {/* <label
            htmlFor="my-modal-edit"
            className="btn bg-red-700 w-[200px] text-white font-semibold p-2 rounded-md text-center border-none hover:bg-red-900 hover:text-white mr-4"
          >
            Edit
          </label>

          <input type="checkbox" id="my-modal-edit" className="modal-toggle" />
          <label htmlFor="my-modal-edit" className="modal cursor-pointer">
            <label
              className="modal-box relative bg-white text-black max-w-xs"
              htmlFor=""
            >
              <h1 className="font-bold text-2xl mb-2 text-gray-800">
                Edit Profile
              </h1>
              <form>
                <input
                  name="fullName"
                  style={{ backgroundColor: "#D2D2D240" }}
                  type="text"
                  placeholder="Full Name"
                  className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
                />
                <input
                  name="email"
                  style={{ backgroundColor: "#D2D2D240" }}
                  type="email"
                  placeholder="Email"
                  className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
                />
                <input
                  name="password"
                  style={{ backgroundColor: "#D2D2D240" }}
                  type="password"
                  placeholder="Password"
                  className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
                />
                <input
                  type="file"
                  style={{ backgroundColor: "#D2D2D240" }}
                  className="file-input file-input-bordered w-full max-w-xs mb-3"
                />
                <input
                  name="phone"
                  style={{ backgroundColor: "#D2D2D240" }}
                  type="number"
                  placeholder="Phone"
                  className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
                />
                <textarea
                  name="address"
                  style={{ backgroundColor: "#D2D2D240" }}
                  className="textarea textarea-bordered text-gray-600 w-full text-md"
                  placeholder="Description"
                ></textarea> */}

                {/* {message && message} */}

                {/* <button
                  type="submit"
                  className="mt-7 btn bg-red-700 w-full text-white font-semibold p-2 rounded-md text-center border-none hover:bg-red-900 hover:text-white mr-4"
                >
                  Save
                </button>
              </form>
            </label>
          </label> */}
        </div>
        <div className="w-[300px]">
          <h1 className="text-2xl font-bold text-black mb-5">
            History Donation
          </h1>

          {data?.slice(0, visible).map((item) => (
            <div key={item?.id} className="bg-white p-3 rounded-md mb-2">
              <h1 className="text-black font-semibold mb-3">
                {item?.donation.title}
              </h1>
              <p className="text-gray-500 mb-[2px]">{item?.donate_at}</p>
              <div className="flex justify-between items-center">
                <p className="text-red-700 font-semibold">
                  Total : Rp{" "}
                  {item?.total.toLocaleString("id-ID").replace(/,/g, ".")}
                </p>
                {item?.status == "success" ? (
                  <p className="text-green-400 bg-green-200 p-2 rounded-md">
                    Finished
                  </p>
                ) : (
                  <p className="text-red-400 bg-red-200 p-2 rounded-md">
                    Pending
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            {visible < data.length && (
              <button
                onClick={loadMore}
                type="btn"
                className="mt-7 btn btn-xs px-5 bg-red-700 w-1/2 text-white font-semibold rounded-md text-center border-none hover:bg-red-900 hover:text-white mr-4"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
