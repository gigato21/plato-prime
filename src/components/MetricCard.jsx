
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, icon: Icon, dayValue, monthValue, yearValue, percentage }) => {
  const isPositive = percentage >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="bg-cartaai-black border-cartaai-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-cartaai-white">{title}</CardTitle>
        <Icon className="h-5 w-5 text-cartaai-red" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-cartaai-white">{dayValue}</p>
            {percentage !== undefined && (
              <span className={`flex items-center text-sm ${trendColor}`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                {Math.abs(percentage)}%
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-xs text-cartaai-white">Mes acumulado</p>
          <p className="text-lg font-semibold text-cartaai-white">{monthValue}</p>
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-xs text-cartaai-white">Año acumulado</p>
          <p className="text-lg font-semibold text-cartaai-white">{yearValue}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
