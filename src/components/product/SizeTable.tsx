import type { SizeVariant } from "@/lib/types";

export function SizeTable({ variants }: { variants: SizeVariant[] }) {
  if (!variants.length) return null;

  const showVolume = variants.some((item) => item.volume);

  return (
    <div className="size-table-wrap">
      <table className="size-table">
        <thead>
          <tr>
            <th>רוחב</th>
            <th>עומק</th>
            <th>גובה</th>
            {showVolume && <th>נפח</th>}
          </tr>
        </thead>
        <tbody>
          {variants.map((item, index) => (
            <tr key={`${item.code ?? "row"}-${index}`}>
              <td className="mono">{item.width ? `${item.width} ס״מ` : "-"}</td>
              <td className="mono">{item.depth ? `${item.depth} ס״מ` : "-"}</td>
              <td className="mono">{item.height ? `${item.height} ס״מ` : "-"}</td>
              {showVolume && <td className="mono">{item.volume ? `${item.volume} ליטר` : "-"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="size-table-hint">מידות בס״מ</div>
    </div>
  );
}
