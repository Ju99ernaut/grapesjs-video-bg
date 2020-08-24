import {
  cmpType
} from './consts';

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const {
    prefix
  } = opts;
  const {
    keys
  } = Object;

  const idTrait = {
    name: 'id',
    label: 'Id'
  };

  const compProps = {
    resize: true,
    autoplay: true,
    buttons: true,
    ...opts.init
  };

  const traits = keys(compProps)
    .map(name => ({
      changeProp: 1,
      type: 'checkbox',
      options: compProps[name],
      min: 0,
      name,
    }));

  domc.addType(cmpType, {
    model: {
      defaults: {
        // Default props
        ...compProps,
        traits: [
          idTrait,
          ...traits
        ],
        stylePfx: prefix,
        attributes: {
          class: prefix + 'container',
        },
        style: {
          height: '100%',
          overflow: 'hidden',
        },
        components: [{
            type: 'video',
            autoplay: true,
            loop: true,
            controls: false,
            attributes: {
              muted: true,
              class: prefix + 'background_video'
            }
          }, {
            tagName: 'div',
            name: 'Overlay',
            attributes: {
              class: prefix + 'overlay'
            }
          }, {
            tagName: 'div',
            name: 'Controls',
            attributes: {
              class: prefix + 'video_controls'
            },
            components: `<span data-gjs-name="Play" class="${prefix}play">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAQlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO4fbyAAAAFXRSTlMAFAn64NVvPvTOwK+dSOpfLI5/UyGtFMIbAAABGElEQVR42u3YW2rDMBSE4bF8t+vEvcz+t1oolOOmTRNBpHnIfCv44QwYC2ZmZmZmZmZmlmXsp26AzsQvXYLGzG8LFBIPFIdY+cOO2njhhMr4y4qqGDRT4J8+UA2DZgoMminwujNqYNBMgf/qUBxveEFhDJop8A4NCmLQTIFBMwXe6x1lMGimwAw9CmDQTIGZNnUA20YUEHpVQGjUAUzqAMoDNnXAog6Y1QEDnnyEozjgDG1AgjRgAJQBC6AMmBKkATugDHhDCaLjh9zjiwJGFCM6fsj98lYPaBPKEhw/I+AV5fG6HjXk/oJVC9hQiej4QXT8IDp+EB0/zJdvMLXtPOgg0B7fHSTiJVJlJXkaYWZmZmZmZmb2SJ9HdKuRZONjqwAAAABJRU5ErkJggg==">
          </span>
          <span data-gjs-name="Pause" class="${prefix}pause">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAASVJREFUeJzt0sEJwlAARMFvWgmpQ61crSOklWAFXkIgyJu5L+zhjQEAAAAAAAAAAAAAAPyr29UHflmW5T3GuB/Z7vv+3LbtfeafeZ4f0zS9Ds4/67o+zvxzlunqA1xLAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAnAAAAAAAAAAAAAAAAgD/1Bbv/DaDuMzHdAAAAAElFTkSuQmCC">
          </span>`
          },
          `<style>
          .${prefix}background_video {
            position: relative;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            object-fit: cover;
            height: 100%; width: 100%;
          }
      
          .${prefix}video_controls {
            position: absolute;
            left: 50%;
            top: 10%;
            transform: translate(-50%, 0);
          }
      
          .${prefix}play img {
            width: 100px;
          }
          .${prefix}pause img {
            width: 90px;
          }
          .${prefix}pause {
            display: none;
          }
      
          @media (min-width: 768px) {
            .${prefix}video_controls {
              display: none;
            }
          }
      
          .${prefix}overlay {
            position: absolute;
            top: 0; right: 0; left: 0; bottom: 0;
            background-color: rgba(0,0,0,0.5);
          }
        </style>`
        ],
        script() {
          // Component
          const el = this;
          //const int = num => parseInt(num, 10) || 0;
          const bool = val => !!val;
          // Plugin options
          const opt = {
            resize: bool('{[ resize ]}'),
            autoplay: bool('{[ autoplay ]}'),
            buttons: bool('{[ buttons ]}'),
            onLoad: 0,
            isMobile: window.matchMedia('(max-width: 768px)').matches
          };
          const pfx = '{[ stylePfx ]}'
          // The Video element
          const videoEl = el.querySelector('.' + pfx + 'background_video');
          // The Pause button
          const pauseBtn = el.querySelector('.' + pfx + 'pause');
          // The Play button
          const playBtn = el.querySelector('.' + pfx + 'play');
          // The Controls element
          const controlsEl = el.querySelector('.' + pfx + 'video_controls');

          let onLoadCalled = false;

          // Initialize and setup the video in DOM`

          // Meta data event
          videoEl.addEventListener('loadedmetadata', resize, false);

          // Fired when enough has been buffered to begin the video
          // self.videoEl.readyState === 4 (HAVE_ENOUGH_DATA)
          videoEl.addEventListener('canplay', function () {
            // Play the video when enough has been buffered
            if (!opt.isMobile) {
              opt.onLoad && opt.onLoad();
              if (opt.autoplay) videoEl.play();
            }
          });

          // If resizing is required (resize video as window/container resizes)
          if (opt.resize) {
            el.addEventListener('resize', resize, false);
          }

          if (opt.isMobile) {
            if (opt.buttons) {
              controlsEl.style.display = 'block';
              videoEl.addEventListener('timeupdate', function () {
                if (!onLoadCalled) {
                  opt.onLoad && opt.onLoad();
                  onLoadCalled = true;
                }
              });


              playBtn.addEventListener('click', function () {
                pauseBtn.style.display = 'inline-block';
                playBtn.style.display = 'none';

                videoEl.play();
              }, false);

              pauseBtn.addEventListener('click', function () {
                pauseBtn.style.display = 'none';
                playBtn.style.display = 'inline-block';

                videoEl.pause();
              }, false);
            } else {
              controlsEl.style.display = 'none';
            }
          }

          // Called once video metadata is available
          //
          // Also called when window/container is resized
          function resize() {
            // IE/Edge still don't support object-fit: cover
            if ('object-fit' in document.body.style) return;

            // Video's intrinsic dimensions
            var w = videoEl.videoWidth,
              h = videoEl.videoHeight;

            // Intrinsic ratio
            // Will be more than 1 if W > H and less if H > W
            var videoRatio = (w / h).toFixed(2);

            // Get the container DOM element and its styles
            //
            // Also calculate the min dimensions required (this will be
            // the container dimentions)
            var container = el,
              containerStyles = global.getComputedStyle(container),
              minW = parseInt(containerStyles.getPropertyValue('width')),
              minH = parseInt(containerStyles.getPropertyValue('height'));

            // If !border-box then add paddings to width and height
            if (containerStyles.getPropertyValue('box-sizing') !== 'border-box') {
              var paddingTop = containerStyles.getPropertyValue('padding-top'),
                paddingBottom = containerStyles.getPropertyValue('padding-bottom'),
                paddingLeft = containerStyles.getPropertyValue('padding-left'),
                paddingRight = containerStyles.getPropertyValue('padding-right');

              paddingTop = parseInt(paddingTop);
              paddingBottom = parseInt(paddingBottom);
              paddingLeft = parseInt(paddingLeft);
              paddingRight = parseInt(paddingRight);

              minW += paddingLeft + paddingRight;
              minH += paddingTop + paddingBottom;
            }

            // What's the min:intrinsic dimensions
            //
            // The idea is to get which of the container dimension
            // has a higher value when compared with the equivalents
            // of the video. Imagine a 1200x700 container and
            // 1000x500 video. Then in order to find the right balance
            // and do minimum scaling, we have to find the dimension
            // with higher ratio.
            //
            // Ex: 1200/1000 = 1.2 and 700/500 = 1.4 - So it is best to
            // scale 500 to 700 and then calculate what should be the
            // right width. If we scale 1000 to 1200 then the height
            // will become 600 proportionately.
            var widthRatio = minW / w;
            var heightRatio = minH / h;

            // Whichever ratio is more, the scaling
            // has to be done over that dimension
            if (widthRatio > heightRatio) {
              var new_width = minW;
              var new_height = Math.ceil(new_width / videoRatio);
            } else {
              var new_height = minH;
              var new_width = Math.ceil(new_height * videoRatio);
            }

            videoEl.style.width = new_width + 'px';
            videoEl.style.height = new_height + 'px';
            console.log('resize', videoEl, controlsEl);
          };
        }
      },
      ...opts.component
    },
  });
};