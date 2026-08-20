import type { SizeVariant } from "@/lib/types";

export function SizeTable({ variants }: { variants: SizeVariant[] }) {
  if (!variants.length) return null;

  const showVolume = variants.some((item) => item.volume);

  return (
    <div className="size-table-wrap">
      <table className="size-table">
        <thead>
          <tr>
            <th>גובה</th>
            <th>עומק</th>
            <th>רוחב</th>
            {showVolume && <th>נפח</th>}
          </tr>
        </thead>
        <tbody>
          {variants.map((item, index) => (
            <tr key={`${item.code ?? "row"}-${index}`}>
              <td>{item.height ? `${item.height} ס״מ` : "-"}</td>
              <td>{item.depth ? `${item.depth} ס״מ` : "-"}</td>
              <td>{item.width ? `${item.width} ס״מ` : "-"}</td>
              {showVolume && <td>{item.volume ? `${item.volume} ליטר` : "-"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
