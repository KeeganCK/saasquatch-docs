import React, { useEffect } from "react";
import { Root, Routes, addPrefetchExcludes } from "react-static";
import { VersionContext } from "./components/useVersion";
import { Switch, Route, useLocation } from "react-router-dom";

import { StickyContainer } from "react-sticky";

import "./assets/stylesheets/docs.less";
import { NavigationHeader } from "./navigation/NavigationHeader";
import { NavigationFooter } from "./navigation/NavigationFooter";
import {
  NavigationSidebar,
  MMenuContext,
} from "./navigation/NavigationSidebar";
import VersionSwitcherModal from "./components/VersionSwitcherModal";
import BrowserOnly from "components/BrowserOnly";
import { PortalifiedSearch } from "./navigation/PortalifiedSearch";
import useBrowserEffect from "./util/useBrowserEffect";

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(["dynamic"]);

// Based on official recommendation from React-Router
// see: https://reacttraining.com/react-router/web/guides/scroll-restoration
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  useBrowserEffect(() => {
    /**
     * Important!
     *
     * This site seems like it's all React, but in reality it still relies on jQuery
     *
     * The source content that comes from static files, contentful, etc. has tabs, popups,
     * and other things that need JQuery post processing.
     *
     * This could probably be moved into only the templates that accept that raw HTML,
     * but for backwards compatibility with the metalsmith build, it wasn't changed.
     *
     */
    const init = require("./assets/js/docs").init;

    init();

    // Decode entities in the URL
    // Sometimes a URL like #/foo#bar will be encoded as #/foo%23bar
    // window.location.hash = window.decodeURIComponent(window.location.hash);
    // const scrollToAnchor = () => {
    //   const hashParts = window.location.hash.split("#");
    //   if (hashParts.length > 2) {
    //     const hash = hashParts.slice(-1)[0];
    //     document.querySelector(`#${hash}`).scrollIntoView();
    //   }
    // };

    // setTimeout(function() {
    //   // TODO: In dev, there is a "Loading.." react compnent that renders
    //   // Maybe this isn't necessary in prod
    //   scrollToAnchor();
    // }, 2000);

    // window.onhashchange = scrollToAnchor;
  }, []);

  return (
    <Root>
      <React.Suspense fallback={<em>Loading...</em>}>
        <ScrollToTop />
        <VersionContext.Provider>
          <MMenuContext.Provider>
            <StickyContainer>
              <div id="my-page">
                <NavigationHeader />
                <div id="my-content" className="container-fluid">
                  <Switch>
                    {/* <Route path="/dynamic" component={Dynamic} /> */}
                    <Route render={() => <Routes />} />
                  </Switch>
                  <VersionSwitcherModal />
                </div>
                <div id="my-footer">
                  <NavigationFooter />
                </div>
              </div>
            </StickyContainer>
            <NavigationSidebar />
            <BrowserOnly Component={PortalifiedSearch} />
          </MMenuContext.Provider>
        </VersionContext.Provider>
      </React.Suspense>
    </Root>
  );
}

export default App;
