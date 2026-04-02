import React from 'react';
import {LowerPrimary} from "./LowerPrimary/components/LowerPrimary.tsx";

export const LowerPrimaryDashboard: React.FC<{ initialSubject?: string }> = ({ initialSubject }) => {
  return <LowerPrimary initialSubject={initialSubject} />;
};

