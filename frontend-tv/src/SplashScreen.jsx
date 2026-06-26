import Lottie from "lottie-react";
import animationData from "./assets/animation.json";

export default function SplashScreen({ onFinish }) {
  return (
    <div style={styles.container}>
      <Lottie
        animationData={animationData}
        loop={false}
        onComplete={onFinish}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};