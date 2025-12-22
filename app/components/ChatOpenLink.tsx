"use client";

import { useCallback } from "react";

type ChatFlow = "daypass";

type Props = {
  href?: string;
  className?: string;
  flow?: ChatFlow;
  children: React.ReactNode;
};

export default function ChatOpenLink({ href = "#", className, flow, children }: Props) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const detail: { open: true; flow?: ChatFlow } = { open: true };
      if (flow) detail.flow = flow;
      window.dispatchEvent(new CustomEvent("gc:chat", { detail }));
    },
    [flow]
  );

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}



