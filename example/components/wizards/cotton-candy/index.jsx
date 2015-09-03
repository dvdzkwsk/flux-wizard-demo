import React from 'react';
import { createWizard } from 'halcyon';
import EditFlavor from './steps/edit-flavor';
import EditPrice from './steps/edit-price';

export default createWizard('Cotton Candy Wizard', [
  <EditFlavor />,
  <EditPrice />
]);
