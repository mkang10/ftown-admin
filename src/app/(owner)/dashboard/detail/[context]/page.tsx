import React from 'react';
import DashboardDetailPage from '@/components/Dashboard/DashboardDetailPage';

interface PageProps {
  params: { context: 'imports' | 'dispatches' | 'transfers' };
}

export default function DetailRoute({ params }: PageProps) {
  const { context } = params;
  return <DashboardDetailPage context={context} />;
}
