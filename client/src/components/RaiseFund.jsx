import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/Api"
import noImage from "../assets/images/no-image.webp"

function RaiseFund() {
  // fetching data using useQuery
  let { data: raisefund } = useQuery('donationRaiseFundCache', async () => {
    const response = await API.get('/donation-by-user');
    return response.data.data;
  });

  console.table(raisefund)

  

  return (
    <div className="w-full h-[3000px]" style={{ backgroundColor: "#E5E5E5" }}>
      <div className="w-[950px] mx-auto h-screen pt-10">
        <div className="w-full">
          <Link to={"/form-fund"}>
            <h1 className="bg-red-700 text-white p-3 text-center rounded-md w-[150px] ml-[800px]">
              Make Raise Fund
            </h1>
          </Link>
        </div>
        <div className="w-[100%]">
          <h1 className="text-3xl font-semibold text-black mb-3">
            My Raise Fund
          </h1>

          <div className="gap-5 flex flex-wrap">
            {raisefund?.map((item) => (
              <div key={item?.id}>
                <div className="rounded-md overflow-hidden w-[300px] bg-white">
                  <div className="h-[200px] overflow-hidden object-cover">
                    {item?.thumbnail == "" ? (
                      <img
                        className="object-cover w-full h-[100%]"
                        src={noImage}
                        alt=""
                      />
                    ): (
                      <img
                        className="object-cover w-full h-[100%]"
                        src={item?.thumbnail}
                        alt=""
                      />
                    )}
                    
                  </div>
                  <div className="p-3">
                    <Link to={`/view-fund/${item?.id}`}>
                      <h1 className="text-black font-semibold h-[50px] line-clamp-2">
                        {item?.title}
                      </h1>
                    </Link>
                    <p className="text-gray-500 line-clamp-2">
                      {item?.description}
                    </p>
                    <progress
                      className="progress progress-error w-full"
                      value={item?.current_goal}
                      max={item?.goal}
                    ></progress>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-black font-semibold">Rp {item?.goal.toLocaleString('id-ID').replace(/,/g, '.')}</p>
                      <Link to={`/view-fund/${item?.id}`}>
                        <p className="bg-red-700 text-white font-semibold p-2 rounded-md">
                          View Fund
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default RaiseFund;
