import { useLocation } from "react-router-dom";
import { useGoogleOAuthCallback } from "./api";
import { useEffect } from "react";
import Loader from "@/components/shared/loader";

export const OAuthGoogle = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");

  if (!code) {
    window.opener.postMessage(
      {
        type: "error",
        payload: {
          message: "Google OAuth failed",
          data: null,
        },
      },
      "*"
    );
    window.close();
    return;
  }

  const { data, isSuccess, isError } = useGoogleOAuthCallback(code || "");

  useEffect(() => {
    if (data) {
      window.opener.postMessage({
        type: "success",
        payload: {
          message: "Google OAuth successful",
          data: data,
        },
      });
      window.close();
    }
    if (isError) {
      window.opener.postMessage(
        {
          type: "error",
          payload: {
            message: "Google OAuth failed",
            data: null,
          },
        },
        "*"
      );
      window.close();
    }
  }, [code, isSuccess, isError, data]);

  return (
    <Loader
      size="md"
      showTrustBadge
      variant="fullscreen"
      message="Authenticating with Google..."
    />
  );
};
