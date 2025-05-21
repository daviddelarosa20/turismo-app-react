import { Redirect } from "expo-router";
import "../global.css";
const StartPage = () => {
  return <Redirect href="/login/welcomescreen" />;
};

export default StartPage;
