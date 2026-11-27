"use client";

import { useEffect } from "react";

export default function PortAscii() {
  useEffect(() => {
    if (document.querySelector("script[data-port-ascii]")) return;
    const script = document.createElement("script");
    script.src = "/port-ascii.js";
    script.dataset.portAscii = "1";
    script.async = false;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="port-ascii-layer" aria-hidden="true">
      <div className="port-ascii" id="port-ascii" />
      <div className="port-ascii-vignette" />
    </div>
  );
}
