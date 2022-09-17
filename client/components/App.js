import React, { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  Column,
  Grid,
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  InlineLoading,
} from "carbon-components-react";

import { FitToScreen } from "@carbon/icons-react";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HeaderGlobal />
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

function HeaderGlobal() {
  const navigate = useNavigate();

  const isFetching = useIsFetching();

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
    <Header aria-label="Memo">
      <HeaderName href="#" prefix="" onClick={() => navigate("/")}>
        Memo
      </HeaderName>
      {isFetching > 0 ? (
        <InlineLoading style={{ justifyContent: "end" }} />
      ) : null}
      <HeaderGlobalBar>
        <div className="header__version">v0.1.0</div>
        {false && (
          <HeaderGlobalAction
            tooltipAlignment="end"
            aria-label="Toggle Fullscreen"
            onClick={toggleFullscreen}
          >
            <FitToScreen size={20} />
          </HeaderGlobalAction>
        )}
      </HeaderGlobalBar>
    </Header>
  );
}
