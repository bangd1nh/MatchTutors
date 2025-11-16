import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface HighlightCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  accent: string;
  footer?: string;
  to?: string;
}

export default function HighlightCard({ title, value, subtitle, icon, accent, footer, to }: HighlightCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        {icon}
      </div>
      {footer && <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">{footer}</p>}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 border-l-4 ${accent} transition hover:shadow-lg hover:-translate-y-1`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 border-l-4 ${accent}`}>{content}</div>;
}


