function StatCard({ title, value, icon: Icon, iconBg, iconColor, accent, description }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default group"
    >
      {/* Top row: icon + title */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <span className="text-4xl font-bold text-slate-800">{value}</span>
        <div className={`h-1.5 w-12 rounded-full ${accent}`} />
      </div>
    </div>
  );
}

export default StatCard;
