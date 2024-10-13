import React from 'react';

import ReactDOM from 'react-dom/client';

import { CSVPreview } from './CSVPreview';

const href = 'https://growi.org/';

const CSVPreviewTag = CSVPreview(() => <a href={href}>Hello, GROWI</a>);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CSVPreviewTag
      href={href}
    >Hello, GROWI</CSVPreviewTag>
  </React.StrictMode>,
);
