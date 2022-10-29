import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl">Which item is cooler?</div>
      <div className="p-2" />
      <div className="flex max-w-2xl items-center justify-between rounded border p-8">
        <div className="h-16 w-16 bg-red-200"></div>
        <div className="p-8">Vs.</div>
        <div className="h-16 w-16 bg-red-200"></div>
      </div>
    </div>
  );
};

export default Home;
