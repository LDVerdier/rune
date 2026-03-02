import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function MovePopover() {
  const { t } = useTranslation();

  const rows = [
    { sprint: "0", move: t("creation.move.pace15") },
    { sprint: "1", move: t("creation.move.pace20") },
    { sprint: "2", move: t("creation.move.pace25") },
    { sprint: "3", move: t("creation.move.pace30") },
  ];

  return (
    <ScoreInfoPopover ariaLabel={t("creation.move.triggerLabel")}>
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        {t("creation.move.description")}
      </p>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500">
            <th className="text-left font-semibold pb-1">{t("creation.move.colSprint")}</th>
            <th className="text-right font-semibold pb-1">{t("creation.move.colMove")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sprint} className="text-gray-300">
              <td className="py-0.5">{row.sprint}</td>
              <td className="text-right py-0.5 font-mono">{row.move}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScoreInfoPopover>
  );
}
