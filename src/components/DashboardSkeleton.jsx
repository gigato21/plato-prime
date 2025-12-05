import { Skeleton } from "@/components/ui/skeleton";

const LoadingCard = ({ className = "", delay = 0 }) => (
  <div 
    className={`animate-pulse-custom relative overflow-hidden ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cartaai-white/10 to-transparent loading-shimmer" />
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <LoadingCard className="h-8 w-48 bg-cartaai-white/5 rounded-lg" />
        <LoadingCard className="h-10 w-[180px] bg-cartaai-white/5 rounded-lg" delay={100} />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="glass-container p-6 space-y-4"
          >
            <LoadingCard 
              className="h-[140px] w-full bg-cartaai-white/5 rounded-lg" 
              delay={i * 150}
            />
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass-container p-6">
            <LoadingCard 
              className="h-[300px] w-full bg-cartaai-white/5 rounded-lg" 
              delay={600 + (i * 150)}
            />
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div className="glass-container p-6">
        <LoadingCard 
          className="h-[300px] w-full bg-cartaai-white/5 rounded-lg" 
          delay={900}
        />
      </div>
    </div>
  );
};

export default DashboardSkeleton; 