import React, { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Grid,
  Column,
} from "carbon-components-react";

import { FitToScreen } from "@carbon/icons-react";

const queryClient = new QueryClient();

export default function App() {
  const navigate = useNavigate();

  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.getElementById("app").requestFullscreen();
    }

    setFullscreen(!fullscreen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Header aria-label="Memo">
        <HeaderName href="#" prefix="" onClick={() => navigate("/")}>
          Memo
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            tooltipAlignment="end"
            aria-label="Toggle Fullscreen"
            onClick={toggleFullscreen}
          >
            <FitToScreen size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <Grid>
        <Column
          sm={{ span: 4, start: 0 }}
          md={{ span: 6, start: 2 }}
          lg={{ span: 16, start: 1 }}
        >
          <Outlet />
        </Column>
      </Grid>
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
