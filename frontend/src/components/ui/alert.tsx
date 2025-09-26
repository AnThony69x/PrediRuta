import clsx from "clsx";

interface AlertProps {
  type?: "error" | "success" | "info";
  children: React.ReactNode;
}

const styles = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  info: "bg-blue-50 text-blue-700 border-blue-200"
};

export const Alert: React.FC<AlertProps> = ({ type = "info", children }) => (
  <div
    className={clsx(
      "rounded-md border px-3 py-2 text-sm",
      styles[type]
    )}
  >
    {children}
  </div>
);