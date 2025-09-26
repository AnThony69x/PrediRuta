export const Separator = ({ label }: { label?: string }) => {
  if (!label)
    return <div className="my-2 h-px w-full bg-gray-200" role="separator" />;
  return (
    <div className="my-4 flex items-center gap-2" role="separator">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
};