import { useQuery } from "react-query";
import { API, setAuthToken } from "../config/Api";

function Profile() {

  let { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get("/user-by-login", setAuthToken(localStorage.token));
    return response.data.data;
  });

  const { data: funder } = useQuery("funderByLoginCache", async () => {
    const response = await API.get("/funder-by-login", setAuthToken(localStorage.token));
    return response.data.data;
  });
  

  return (
    <div className="w-full h-screen" style={{ backgroundColor: "#E5E5E5" }}>
      <div className="flex justify-center pt-10">
        <div className="w-[500px]">
          <h1 className="text-2xl font-bold text-black mb-5">My Profile</h1>
          <div className="flex">
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
        </div>
        <div className="w-[300px]">
          <h1 className="text-2xl font-bold text-black mb-5">
            History Donation
          </h1>

          {funder?.slice(0, 3).map((item) => (
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
            {funder?.length >= 3 && (
              <button
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
