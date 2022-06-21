import { Container, createTheme, Grid, ThemeProvider } from "@mui/material";
import { requester } from "api/common";
import UsersEndpoints from "api/users";
import type { AppProps } from "next/app";
import { ARProvider } from "providers/ARProvider";
import { useEffect } from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const continueAsGuest = async () => {
    const res = await requester(UsersEndpoints.create);
    localStorage.setItem("userId", res.data.user._id);
  };

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      continueAsGuest();
    }
  }, []);
  return (
    <ARProvider>
      <ThemeProvider theme={createTheme({ components: { MuiButton: { defaultProps: { variant: "contained" } } } })}>
        <Container maxWidth="sm">
          <Grid container direction={"column"} alignItems="center" justifyContent={"center"} sx={{ height: "100vh" }}>
            <Component {...pageProps} />
          </Grid>
        </Container>
      </ThemeProvider>
    </ARProvider>
  );
}

export default MyApp;
