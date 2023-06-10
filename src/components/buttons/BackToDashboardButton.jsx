import { useNavigate } from "react-router-dom";

export default function BackToDashboardButton({}) {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center justify-center gap-1 bg-gray-700 font-bold text-gray-100 text-sm rounded p-2 shadow hover:bg-gray-600"
      onClick={() => navigate("/")}
    >
      <span className="text-[1.3rem]">⬅</span>
      {" Back To Dashboard"}
    </button>
  );
}
