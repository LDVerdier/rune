import { useTranslation } from "react-i18next";
import type { AbilityDefinition } from "~/domain/abilities";

interface AbilityChartProps {
  ability: AbilityDefinition;
}

export function AbilityChart({ ability }: AbilityChartProps) {
  const { t } = useTranslation();
  if (!ability.chart) return null;
  const { columns, rows } = ability.chart;
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-xs text-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left py-1 px-2 text-gray-500 font-medium border-b border-content3">
                {t(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-content3/50">
              {columns.map((col) => (
                <td key={col} className="py-1 px-2">
                  {t(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
