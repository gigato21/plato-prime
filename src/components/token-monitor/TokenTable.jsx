import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TokenTable = ({ conversations }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-700 dark:text-gray-300">Subdominio</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Local ID</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Número Cliente</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Tokens Prompt</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Tokens Completion</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Total Tokens</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conv) => (
            <TableRow key={conv.id}>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{conv.subdomain}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{conv.localId}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{conv.clientNumber}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{conv.tokens.promptTokens}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{conv.tokens.completionTokens}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{conv.totalTokens}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  conv.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {conv.status === 'completed' ? 'Completado' : 'En Progreso'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TokenTable;