import React, { useLayoutEffect } from "react";
import { Root, Routes, addPrefetchExcludes } from "react-static";
import { VersionContext } from "./components/useVersion";
// import { Link, Router } from "@reach/router";
import {StickyContainer} from "react-sticky"

import "./assets/stylesheets/docs.less";
import { NavigationHeader } from "./navigation/NavigationHeader";
import { NavigationFooter } from "./navigation/NavigationFooter";
import { NavigationSidebar } from "./navigation/NavigationSidebar";

let init = () => {};
if (typeof document !== "undefined") {
  init = require("./assets/js/docs").init;
}

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(["dynamic"]);

function App() {
  useLayoutEffect(() => {
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
      <VersionContext.Provider>
        <StickyContainer>
          <div id="my-page">
            <NavigationHeader />
            <div id="my-content" className="container-fluid">
              <React.Suspense fallback={<em>Loading...</em>}>
                {/* <Router> */}
                {/* <Dynamic path="dynamic" /> */}
                <Routes default />
                {/* </Router> */}
              </React.Suspense>
            </div>
            <div id="my-footer">
              <NavigationFooter />
            </div>
          </div>
        </StickyContainer>
        <NavigationSidebar />
      </VersionContext.Provider>
    </Root>
  );
}

export default App;
