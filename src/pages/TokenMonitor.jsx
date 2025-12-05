import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import TokenMetrics from "@/components/token-monitor/TokenMetrics";
import TokenTable from "@/components/token-monitor/TokenTable";
import TokenFilters from "@/components/token-monitor/TokenFilters";
import NoResultsFound from "@/components/token-monitor/NoResultsFound";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getApiUrls } from "@/config/api";
import { useSelector } from "react-redux";
import { format } from 'date-fns';

const TokenMonitor = () => {
  const API_URLS = getApiUrls();
  const [filters, setFilters] = useState({
    subdomain: "",
    localId: "",
    startDate: null,
    endDate: null,
    status: "all",
    conversationState: "all"
  });

  const accessToken = useSelector((state) => state.auth.accessToken);

  const buildQueryString = (filters) => {
    const params = new URLSearchParams();
    
    if (filters.subdomain) params.append('subDomain', filters.subdomain);
    if (filters.localId) params.append('localId', filters.localId);
    if (filters.startDate) params.append('startDate', format(filters.startDate, 'dd/MM/yyyy'));
    if (filters.endDate) params.append('endDate', format(filters.endDate, 'dd/MM/yyyy'));
    if (filters.conversationState !== 'all') params.append('conversationState', filters.conversationState);
    
    return params.toString();
  };

  const { data, isLoading } = useQuery({
    queryKey: ['token-metrics', filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const url = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/tokens-usage${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      
      const rawData = await response.json();
      
      if (rawData.type !== "1") {
        throw new Error(rawData.message || 'Error en la respuesta del servidor');
      }

      const processedData = {
        conversations: [],
        metrics: {
          totalTokens: 0,
          tokensByModel: {
            gpt4: 0,
            gpt4o: 0
          },
          totalConversations: 0,
          totalCostUSD: 0
        }
      };

      rawData.data.forEach(client => {
        client.conversations.forEach(conv => {
          const tokenUsage = conv.tokensUsage[0];
          
          processedData.conversations.push({
            id: conv.conversationUUID,
            subdomain: client.subDomain,
            localId: client.localId,
            clientNumber: client.clientPhone,
            tokens: {
              promptTokens: tokenUsage.prompt_tokens,
              completionTokens: tokenUsage.completion_tokens
            },
            totalTokens: tokenUsage.total_tokens,
            status: conv.conversationState === 1 ? 'completed' : 'in_progress',
            createdAt: new Date().toISOString()
          });

          processedData.metrics.totalTokens += tokenUsage.total_tokens;
          processedData.metrics.tokensByModel[tokenUsage.aiModel === 'gpt-4o' ? 'gpt4o' : 'gpt4'] += tokenUsage.total_tokens;
          processedData.metrics.totalCostUSD += conv.totalConversationCost;
        });
      });

      processedData.metrics.totalConversations = processedData.conversations.length;
      
      return processedData;
    }
  });

  const handleExport = async () => {
    try {
      const queryString = buildQueryString(filters);
      const url = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/tokens-usage/export-excel${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `token_usage_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success("Archivo descargado correctamente");
    } catch (error) {
      console.error('Error al descargar el archivo Excel:', error);
      toast.error("Error al descargar el archivo");
    }
  };

  const filteredConversations = data?.conversations.filter(conv => {
    if (filters.status === "all") return true;
    return conv.status === filters.status;
  }) || [];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Monitor de Tokens</h1>
        <Button 
          onClick={handleExport}
          disabled={isLoading}
          className="w-full sm:w-auto bg-cartaai-red hover:bg-cartaai-red/80"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar Datos
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-container p-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cartaai-red"></div>
            </div>
          ) : (
            <TokenMetrics metrics={data?.metrics} />
          )}
        </div>
        
        <div className="glass-container p-4">
          <TokenFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="glass-container overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cartaai-red"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <NoResultsFound onClearFilters={() => handleFilterChange({
              subdomain: "",
              localId: "",
              startDate: null,
              endDate: null,
              status: "all",
              conversationState: "all"
            })} />
          ) : (
            <TokenTable conversations={filteredConversations} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenMonitor;
