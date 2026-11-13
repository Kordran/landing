"use client";

import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

type TrackLinkProps = ComponentProps<"a"> & {
  event: string;
  eventParams?: Record<string, string | number>;
};

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export default function TrackLink({
  event,
  eventParams,
  onClick,
  href,
  ...props
}: TrackLinkProps) {
  const handleClick = (eventClick: MouseEvent<HTMLAnchorElement>) => {
    track(event, eventParams);
    onClick?.(eventClick);
  };

  if (typeof href === "string" && isInternal(href)) {
    return <Link href={href} {...props} onClick={handleClick} />;
  }

  return <a href={href} {...props} onClick={handleClick} />;
}
