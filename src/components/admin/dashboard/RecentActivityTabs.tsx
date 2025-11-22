import { useEffect, useState, type ReactNode } from "react";

export interface TableColumn {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => ReactNode;
}

export interface RecentActivityTabConfig {
  key: string;
  title: string;
  columns: TableColumn[];
  data: any[];
  emptyMessage?: string;
}

export default function RecentActivityTabs({ tabs }: { tabs: RecentActivityTabConfig[] }) {
  const [activeKey, setActiveKey] = useState<string>(tabs[0]?.key ?? "");

  useEffect(() => {
    if (!tabs.length) {
      return;
    }
    if (!tabs.some((tab) => tab.key === activeKey)) {
      setActiveKey(tabs[0].key);
    }
  }, [tabs, activeKey]);

  if (!tabs.length) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  return (
    <section>
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = tab.key === activeKey;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveKey(tab.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? "bg-indigo-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
        <div className="overflow-x-auto">
          {(activeTab.data?.length ?? 0) === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">{activeTab.emptyMessage ?? "Không có dữ liệu"}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab.columns.map((column, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab.data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {activeTab.columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}


