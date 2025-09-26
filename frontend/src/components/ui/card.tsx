import * as React from "react";
import clsx from "clsx";

export const Card = ({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "rounded-lg border border-gray-200 bg-white shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({
  children,
  className
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("p-4 border-b", className)}>{children}</div>
);

export const CardTitle = ({
  children,
  className
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={clsx("text-lg font-semibold", className)}>{children}</h2>
);

export const CardContent = ({
  children,
  className
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("p-4 space-y-4", className)}>{children}</div>
);

export const CardFooter = ({
  children,
  className
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("p-4 border-t", className)}>{children}</div>
);