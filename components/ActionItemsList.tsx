
import React from 'react';
import { ActionItem } from '../types';

interface ActionItemsListProps {
  items: ActionItem[];
}

export const ActionItemsList: React.FC<ActionItemsListProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Action Items
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic">No action items identified yet.</td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.task}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${item.owner === 'TBD' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {item.owner}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.deadline}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
