import AuthProvider from "@/provider/Auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Router } from "next/router";
import Progress from "@badrap/bar-of-progress";

const progress = new Progress({
  className: "bar-of-progress",
  color: "#F35815",
  delay: 100,
});

Router.events.on("routeChangeStart", () => progress.start());
Router.events.on("routeChangeComplete", () => progress.finish());
Router.events.on("routeChangeError", () => progress.finish());

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href="https://cdn.uploadfly.cloud/xCnc4L/favicon-orange-mPuTin-huL.png"
        />
      </Head>
      <AuthProvider>
        <Toaster />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
