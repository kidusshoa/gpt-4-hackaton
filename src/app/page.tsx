import Image from "next/image";
import LoginPage from "./login/page";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div>
      <LoginPage />
      <ToastContainer />
    </div>
  );
}
