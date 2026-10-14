const ConfigurationSection = ({ icon: Icon, title, description, children }) => {
  return (
    <section className="space-y-3.5">
      <div className="flex items-start gap-2.5">
        {Icon && <Icon size={17} className="mt-0.5 shrink-0 text-cyan-300" />}

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>

          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-700/60 bg-[#0d1219] p-4 sm:grid-cols-2 sm:p-4">
        {children}
      </div>
    </section>
  );
};

export default ConfigurationSection;
