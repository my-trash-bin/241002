import { PropsWithChildren } from "react";

import "./global.css";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>241002</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
