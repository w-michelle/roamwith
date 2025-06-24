interface EmptyStateProp {
  title: string;
  subtitle?: string;
}
const EmptyState: React.FC<EmptyStateProp> = ({ title, subtitle }) => {
  return (
    <div className="text-neutral-500 w-full flex items-center justify-center mt-4">
      <h2>{title}</h2>
      <h3>{subtitle}</h3>
    </div>
  );
};

export default EmptyState;
