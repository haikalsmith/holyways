import Header1 from "../assets/images/header1.png";
import Header2 from "../assets/images/header2.png";
import noImage from "../assets/images/no-image.webp";
import { Link } from "react-router-dom";
import { API } from "../config/Api";
import { useQuery } from "react-query";
import { useState } from "react";

function Home() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(3);

  useQuery("donationsHomeChache", async () => {
    const response = await API.get(`/donations`);
    setData(response.data.data);
    return response.data.data;
  });

  const loadMore = () => {
    setVisible((prev) => prev + 3);
  };

  function scrollSmooth() {
    var target = document.getElementById("home-list");
    target.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="bg-red-700">
      <div className="pt-20">
        <div className="pt-9 w-[750px] ml-24" style={{ color: "#E8E8E8" }}>
          <h1 className="text-5xl font-bold mb-8">
            While you are still standing, try to reach out to the people who are
            falling.
          </h1>
          <p className="mb-8 w-[700px]">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.{" "}
          </p>
          <button 
            onClick={scrollSmooth}
            className="btn bg-white text-red-700 font-bold border-none hover:bg-red-700 hover:text-white mb-20">
            Donate Now
          </button>
        </div>
        <img
          src={Header1}
          alt=""
          className="absolute right-0 top-[160px] w-[515px]"
        />
      </div>

      <div className="" style={{ backgroundColor: "#E5E5E5" }}>
        <img
          src={Header2}
          alt=""
          className="absolute left-0 top-[570px] w-[423px]"
        />

        <div
          className="pt-40 w-[750px] mt-20 ml-[500px]"
          style={{ color: "#000" }}
        >
          <h1 className="text-5xl font-bold mb-8">
            Your donation is very helpful for people affected by forest fires in
            Kalimantan.
          </h1>
          <div className="flex justify-between">
            <p className="mb-8 w-[47%]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industrys standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <p className="w-[47%]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industrys standard dummy text
              ever since the 1500s.
            </p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#E5E5E5" }} className="pb-10 pt-60">
        <h1 className="font-bold text-red-700 text-center text-4xl mb-10">
          Donate Now
        </h1>

        <div className="w-[1200px] mx-auto" id="home-list">
          <div className="flex gap-4 flex-wrap">
            {data?.slice(0, visible).map((item) => (
              <div
                key={item?.id}
                className="card w-96 bg-white shadow-xl rounded-md overflow-hidden"
              >
                <div className="bg-white h-[250px] overflow-hidden object-cover">
                  {item?.thumbnail == "" ? (
                    <img
                      className="object-cover w-full h-[100%]"
                      src={noImage}
                      alt=""
                    />
                  ) : (
                    <img
                      className="object-cover w-full h-[100%]"
                      src={item?.thumbnail}
                      alt={item?.title}
                    />
                  )}
                </div>
                <div className="card-body overflow-hidden p-5">
                  <Link to={`/detail-donate/${item?.id}`}>
                    <h2 className="card-title text-black line-clamp-2 h-[60px]">
                      {item?.title}
                    </h2>
                  </Link>
                  <h2 style={{ color: "#616161" }} className="line-clamp-2">
                    {item?.description}
                  </h2>
                  <progress
                    className="progress progress-error w-full"
                    value={item?.current_goal}
                    max={item?.goal}
                  ></progress>
                  <div className="flex items-center mt-3">
                    <p className="text-black font-semibold">
                      Rp {item?.goal.toLocaleString("id-ID").replace(/,/g, ".")}
                    </p>
                    <Link to={`/detail-donate/${item?.id}`}>
                      <button className="bg-red-700 text-white font-semibold rounded-md py-2 px-4">
                        Donate
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {visible < data.length && (
              <div className="w-full flex justify-center">
                <button
                  onClick={loadMore}
                  className="bg-red-700 p-3 text-white font-semibold rounded-md"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
