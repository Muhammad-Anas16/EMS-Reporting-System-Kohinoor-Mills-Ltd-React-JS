const Panel = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-white/[0.07] bg-[#0a0f14]/90 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </div>
  );
};

export default Panel;
