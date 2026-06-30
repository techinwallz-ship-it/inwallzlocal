import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function FacebookCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");

    if (userId && username) {
      localStorage.setItem("role", "client");

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId,
          username,
        })
      );

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return <h2>Signing you in with Facebook...</h2>;
}

export default FacebookCallback;