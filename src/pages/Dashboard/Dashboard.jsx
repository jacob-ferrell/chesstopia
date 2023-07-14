import Tabs from "./Tabs";

export default function Dashboard({ setGame }) {

  return (
    <div className="w-full h-full pt-4 flex flex-col gap-2 items-center"> 
      <Tabs setGame={setGame} /> 
    </div>
  );
}
