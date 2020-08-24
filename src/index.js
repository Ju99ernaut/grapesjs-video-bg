import loadComponents from './components';
import loadBlocks from './blocks';

export default (editor, opts = {}) => {
  const options = {
    ...{
      // default options
      // block label
      label: 'Video BG',
      // block category
      category: 'Extra',
      // block extension options
      block: {},
      // component model extension options
      component: {},
      // style prefix
      prefix: 'bg-',
      // initial settings/config for the block script
      init: {},
      // do stuff when video is loaded
      onLoad: () => {},
      // mobile detection
      isMobile: window.matchMedia('(max-width: 768px)').matches
    },
    ...opts
  };

  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
};