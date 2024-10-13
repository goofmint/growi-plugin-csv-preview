import config from './package.json';
import { CSVPreview } from './src/CSVPreview';
import { Options, Func, ViewOptions } from './types/utils';

declare const growiFacade : {
  markdownRenderer?: {
    optionsGenerators: {
      customGenerateViewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      generateViewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      generatePreviewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      customGeneratePreviewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
    },
  },
};

const activate = (): void => {
  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;

  // For page view
  optionsGenerators.customGenerateViewOptions = (...args) => {
    const options = optionsGenerators.generateViewOptions(...args);
    const { attachment } = options.components;
    options.components.attachment = CSVPreview(attachment); // Wrap the default component
    return options;
  };

  // For preview
  optionsGenerators.customGeneratePreviewOptions = (...args) => {
    const preview = optionsGenerators.generatePreviewOptions(...args);
    const { attachment } = preview.components;
    preview.components.attachment = CSVPreview(attachment); // Wrap the default component
    return preview;
  };
};

const deactivate = (): void => {
};

// register activate
if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators[config.name] = {
  activate,
  deactivate,
};
