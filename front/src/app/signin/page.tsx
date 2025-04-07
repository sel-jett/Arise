import Image from "next/image";
import Link from "next/link";

const SignIn: React.FC = () => {
  return (
    <>
      <div className="flex h-screen w-screen">
        <div className="flex-1 h-full w-full bg-[#B1B0B0] flex-row justify-center items-center">
          <div className="flex flex-col h-full mx-auto w-3/4 lg:w-3/4 xl:w-3/5 py-8">
            <Image
              src="/logo/logo.svg"
              width={80}
              height={80}
              alt="Home page"
            />
            <div className="h-full w-full space-y-6 content-center">
              <p className="font-kode font-bold text-xl pb-6">
                Welcome to PONG <br />
                sign up to play your first game.
              </p>
              <button className="bg-[#D9D9D9] font-koh w-full h-[37px] inline-flex justify-center gap-x-4 items-center mr-2 rounded-xl">
                <Image
                  src="/logo/google-logo.svg"
                  width={20}
                  height={24}
                  alt="Continue with google"
                />
                Continue with google
              </button>
              <form action="" className="space-y-3">
                <input
                  required
                  type="text"
                  name="Username"
                  placeholder="Username"
                  className="bg-[#D9D9D9] font-koh w-full h-[42px] rounded-lg font-light border-[0.1px] border-gray-500 pl-6"
                />

                <input
                  required
                  type="password"
                  name="Password"
                  placeholder="Password"
                  className="bg-[#D9D9D9] font-koh w-full h-[42px] rounded-lg font-light border-[0.1px] border-gray-500 pl-6"
                />

                <button className="bg-black text-white w-full h-[50px] rounded-lg font-koh">
                  Continue
                </button>
              </form>
              <button className="bg-black text-white font-koh w-full h-[50px] inline-flex justify-center gap-x-2 items-center rounded-lg">
                <Image
                  src="/logo/42.svg"
                  width={20}
                  height={24}
                  alt="Continue with intra"
                />
                Continue with intra
              </button>
              <div>
                <div className="flex justify-center">
                  <Link
                    href="/signup"
                    className="font-koh text-black justify-center underline"
                  >
                    Don't have account? Create one here. <br />
                  </Link>
                </div>
                <div className="flex justify-center">
                  <Link
                    href="/reset-password"
                    className="font-koh text-black justify-center underline"
                  >
                    Forgot your password? <br />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-center text-sm">
              <p className="font-koh text-black justify-center underline">
                By using PONG, you are agreeing to <br />
                our privacy policy and terms of service.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex-row h-full max-md:hidden">
          <div className="flex-1 h-1/2 bg-[url('/images/login-image.svg')] bg-cover bg-center"></div>

          <div className="flex-1 h-1/2 bg-[#3D3D3D]">
            <div className="flex justify-center font-bold pt-6">
              <p className="font-koh">developers from</p>
            </div>
            <div className="flex justify-center font-bold pt-6 gap-x-6">
              <Image src="/logo/1337.svg" width={78} height={20} alt="1337" />
              <Image
                src="/logo/42-the-network.svg"
                width={145}
                height={23}
                alt="42 the network"
              />
              <Image src="/logo/um6p.svg" width={100} height={26} alt="um6p" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
