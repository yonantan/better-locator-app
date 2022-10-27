import type { NextPage } from "next";
import { useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { trpc } from "../utils/trpc";
import useLocalStorage from "../utils/useLocalStorage";

const Home: NextPage = () => {
  const [inputValue, setInputValue] = useState("");

  const [nickname, setNickname] = useLocalStorage<string>("nickname", "");

  const { latitude, longitude } = useGeolocation();

  const pushPullEnabled = Boolean(latitude && longitude && nickname);

  const { data } = trpc.example.pushPull.useQuery(
    {
      latitude,
      longitude,
      nickname,
    },
    {
      enabled: pushPullEnabled,
      refetchIntervalInBackground: pushPullEnabled,
      refetchInterval: 10000,
    }
  );

  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        {pushPullEnabled && (
          <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
            <span className="text-purple-300">Hello,</span>&nbsp; {nickname}
          </h1>
        )}
        {pushPullEnabled && (
          <div>
            {data && <p>Here are your connections:</p>}
            <ol className="list-decimal">
              {data &&
                data?.users.map((d) => {
                  return (
                    <li key={d.nickname}>
                      <span className="m-2">{d.nickname}</span>
                      <span className="m-2">{d.distance}m</span>
                      <span className="m-2">
                        {Date.now() - d.timestamp > 10000 && "offline"}
                      </span>
                    </li>
                  );
                })}
            </ol>
          </div>
        )}

        {!pushPullEnabled && (
          <div className="pin fixed flex h-screen w-screen items-center">
            <div className="pin fixed z-10 bg-black opacity-75"></div>

            <div className="relative z-20 m-8 mx-6 h-screen w-full md:mx-auto md:w-1/2 lg:w-1/3">
              <div className="h-full rounded-lg bg-white p-8">
                <h1 className="text-green-dark text-center text-2xl">Login</h1>
                <form
                  className="my-2 h-full pt-6  pb-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setNickname(inputValue);
                  }}
                >
                  <div className="mb-4">
                    <label
                      className="mb-2 block text-sm font-bold"
                      htmlFor="nickname"
                    >
                      Nickname
                    </label>
                    <input
                      className="text-grey-darker w-full appearance-none rounded border py-2 px-3 shadow"
                      id="nickname"
                      type="text"
                      placeholder="Nickname"
                      onChange={(event) =>
                        setInputValue(event.currentTarget.value)
                      }
                    />
                  </div>
                  <div className="block items-center justify-between md:flex">
                    <div>
                      <button
                        className="bg-green hover:bg-green-dark border-green-darkest rounded border-b-4 py-2 px-4 font-bold"
                        type="submit"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
