import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import Button from "../ui/Button";

export default function BackToDashboardButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline" size="md" onClick={() => navigate("/")}>
      <ArrowLeft className="h-4 w-4" />
      Back to dashboard
    </Button>
  );
}
