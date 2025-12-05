import { Card } from "@/components/ui/card";
import { MessageSquare, Hash, DollarSign } from "lucide-react";

const MetricCard = ({ title, value, icon: Icon }) => (
  <Card className="p-4 glass-container">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-gray-700 dark:text-gray-200">{value}</p>
      </div>
      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-cartaai-red" />
    </div>
  </Card>
);

const TokenMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total de Tokens"
        value={metrics?.totalTokens?.toLocaleString()}
        icon={Hash}
      />
      <Card className="p-4 glass-container">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tokens por modelo</h3>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">GPT-4</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {metrics?.tokensByModel?.gpt4?.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">GPT-4o</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {metrics?.tokensByModel?.gpt4o?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
      <MetricCard
        title="Total Conversaciones"
        value={metrics?.totalConversations?.toLocaleString()}
        icon={MessageSquare}
      />
      <MetricCard
        title="Costo Total USD"
        value={`$${metrics?.totalCostUSD?.toFixed(3)}`}
        icon={DollarSign}
      />
    </div>
  );
};

export default TokenMetrics;