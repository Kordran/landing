"use client";

import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";

type TrackLinkProps = ComponentProps<"a"> & {
  event: string;
  eventParams?: Record<string, string | number>;
};

export default function TrackLink({
  event,
  eventParams,
  onClick,
  ...props
}: TrackLinkProps) {
  return (
    <a
      {...props}
      onClick={(eventClick) => {
        track(event, eventParams);
        onClick?.(eventClick);
      }}
    />
  );
}
