import { Router, NavigationType } from "react-router";
import { useLayoutEffect, useMemo, useState } from "react";

function getLocation() {
  const { pathname, search, hash } = window.location;
  const st = window.history.state || {};
  return {
    pathname: pathname || "/",
    search: search || "",
    hash: hash || "",
    state: st.usr ?? null,
    key: st.key || "default",
  };
}

export default function BrowserRouterLite({ basename = "", children }) {
  const [locState, setLocState] = useState({
    action: NavigationType.Pop,
    location: getLocation(),
  });

  const navigator = useMemo(() => ({
    push(to, state) {
      const url = typeof to === "string" ? to : to.pathname + (to.search || "") + (to.hash || "");
      const key = Math.random().toString(36).slice(2);
      window.history.pushState({ usr: state, key }, "", url);
      setLocState({ action: NavigationType.Push, location: getLocation() });
    },
    replace(to, state) {
      const url = typeof to === "string" ? to : to.pathname + (to.search || "") + (to.hash || "");
      const key = Math.random().toString(36).slice(2);
      window.history.replaceState({ usr: state, key }, "", url);
      setLocState({ action: NavigationType.Replace, location: getLocation() });
    },
    go(n) { window.history.go(n); },
    createHref(to) {
      const url = typeof to === "string" ? to : to.pathname + (to.search || "") + (to.hash || "");
      return basename ? basename + url : url;
    },
  }), [basename]);

  useLayoutEffect(() => {
    const onPop = () => setLocState({ action: NavigationType.Pop, location: getLocation() });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <Router
      basename={basename}
      location={locState.location}
      navigationType={locState.action}
      navigator={navigator}
    >
      {children}
    </Router>
  );
}
