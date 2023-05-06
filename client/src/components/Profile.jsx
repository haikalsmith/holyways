import { useQuery } from "react-query";
import { API } from "../config/Api";

function Profile() {
  let { data: profile } = useQuery('profileCache', async () => {
    const response = await API.get('/user-by-login');
    return response.data.data;
  });

  const {data: funder} = useQuery("funderCache", async () => {
    const response = await API.get("/funder")
    return response.data.data
})

  return (
    <div className="w-full h-screen" style={{backgroundColor: "#E5E5E5"}}>
    <div className="flex justify-center pt-10">
      <div className="w-[500px]">
        <h1 className="text-2xl font-bold text-black mb-5">My Profile</h1>
        <div className="flex">
          <img className="w-[200px] mr-5 rounded-md" src="https://i.pinimg.com/originals/47/4f/5f/474f5fa00f60fb5c2e47c9dfcd7b1593.jpg" alt=""/>
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
        <h1 className="text-2xl font-bold text-black mb-5">History Donation</h1>
        <div className="bg-white p-3 rounded-md">
          <h1 className="text-black font-semibold mb-3">{funder?.donation.title}</h1>
          <p className="text-gray-500 mb-[2px]">{funder?.donate_at}</p>
          <div className="flex justify-between items-center">
            <p className="text-red-700">Total : Rp {funder?.total.toLocaleString('id-ID').replace(/,/g, '.')}</p>
            {funder?.status == "success" ? (
              <p className="text-green-400 bg-green-200 p-2 rounded-md">Finished</p>
            ): (
                <p className="text-red-400 bg-red-200 p-2 rounded-md">Pending</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Profile