import type { SizeVariant } from "@/lib/types";

export function SizeTable({ variants }: { variants: SizeVariant[] }) {
  if (!variants.length) return null;

  const showCode = variants.some((item) => item.code);
  const showVolume = variants.some((item) => item.volume);
  const showModel = variants.some((item) => item.modelName);

  return (
    <div className="size-table-wrap">
      <table className="size-table">
        <thead>
          <tr>
            {showCode && <th>קוד</th>}
            <th>רוחב</th>
            <th>עומק</th>
            <th>גובה</th>
            {showVolume && <th>נפח</th>}
            {showModel && <th>דגם ספק</th>}
          </tr>
        </thead>
        <tbody>
          {variants.map((item, index) => (
            <tr key={`${item.code ?? "row"}-${index}`}>
              {showCode && <td className="mono ltr">{item.code ?? "-"}</td>}
              <td className="mono ltr">{item.width ? `${item.width}` : "-"}</td>
              <td className="mono ltr">{item.depth ? `${item.depth}` : "-"}</td>
              <td className="mono ltr">{item.height ? `${item.height}` : "-"}</td>
              {showVolume && <td className="mono ltr">{item.volume ? `${item.volume} ל׳` : "-"}</td>}
              {showModel && <td>{item.modelName ?? "-"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="size-table-hint">מידות בס״מ</div>
    </div>
  );
}
