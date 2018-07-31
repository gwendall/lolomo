import React from 'react';
import styled, { keyframes } from 'styled-components';

const ItemDefaultRendered = ({
  item: { color },
  index,
  active,
  toggleActive,
  setActive,
  removeActive,
  speedMove,
  width,
  widthPercent,
  scaleActiveBy,
  spaceBetween,
}) => (
  <ItemDefault
    onClick={toggleActive}
    style={{
      backgroundColor: color,
    }}
  >
    <div>{index}</div>
    <span>
      {active && (
        <ItemDefaultActive
          style={{
            backgroundColor: color,
          }}
          onClick={toggleActive}
          {...{
            speedMove,
            width,
            widthPercent,
            scaleActiveBy,
            spaceBetween,
          }}
        >
          <div>{index}</div>
        </ItemDefaultActive>
      )}
    </span>
  </ItemDefault>
);
const ItemDefault = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  position: relative;
  cursor: pointer;
  user-select: none;
`;
const ItemDefaultActive = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  width: ${({ widthPercent, scaleActiveBy }) => (scaleActiveBy / 2 + 1) * 100}%;
  left: ${({ widthPercent, scaleActiveBy }) => (-(scaleActiveBy / 2) * 100) / 2}%;
  margin: 0 -${({ spaceBetween }) => spaceBetween * 2}px;
`;

/*
animation: ${keyframes`
  0% {
    transform: scale(.7);
  }
  100% {
    transform: scale(1);
  }
`} ${({ speedMove }) => speedMove}ms cubic-bezier(0.5, 0, 0.1, 1);
*/

export default class Lolomo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, scroll: 0, active: null };
    this.sliderInnerRef = null;
    this.timeoutEnter = null;
    this.timeoutLeave = null;
  }
  componentDidMount() {
    this.setState({ width: 0, scroll: 0, active: null });
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
  onResize = () => {
    const width = this.sliderInnerRef.getBoundingClientRect().width;
    this.setState({ width });
  };
  goToPrev = () => {
    this.setState({
      scroll: Math.min(0, this.state.scroll + this.state.width),
      active: null,
    });
  };
  goToNext = () => {
    this.setState({
      scroll: Math.max(
        this.state.scroll - this.state.width,
        -1 * this.state.width * (this.getNumberOfSlides() - 1)
      ),
      active: null,
    });
  };
  canGoToNext = () => {
    const index = Math.abs(this.state.scroll / this.state.width);
    const indexMax = this.getNumberOfSlides() - 1;
    return index < indexMax;
  };
  getNumberOfSlides = () => {
    const { items = [], itemsPerSlide } = this.props;
    return Math.max(0, Math.ceil(items.length / itemsPerSlide) - 1) + 1;
  };
  setActive = i => {
    this.timeoutLeave && clearTimeout(this.timeoutLeave);
    this.timeoutEnter = setTimeout(() => this.setState({ active: i }), 250);
    // this.setState({ active: i });
    // this.timeout = setTimeout(() => this.setState({ active: i }), 300);
  };
  removeActive = () => {
    this.timeoutEnter && clearTimeout(this.timeoutEnter);
    this.timeoutLeave = setTimeout(() => this.setState({ active: null }), 500);
    // this.setState({ active: null });
  };
  toggleActive = i => {
    if (this.state.active === i) {
      this.removeActive();
    } else {
      this.setActive(i);
    }
  };
  render() {
    const {
      items,
      itemsPerSlide,
      scaleActiveBy,
      navPadding,
      spaceBetween,
      speedSlide,
      speedMove,
      backgroundColor,
    } = this.props;
    const itemWidth = +(this.state.width / itemsPerSlide).toFixed(2);
    const itemWidthPercent = +(100 / itemsPerSlide).toFixed(6);
    const firstIsActive =
      Number.isInteger(this.state.active) && Number.isInteger(this.state.active / itemsPerSlide);
    const lastIsActive =
      Number.isInteger(this.state.active) &&
      Number.isInteger((this.state.active + 1) / itemsPerSlide);
    return (
      <React.Fragment>
        <Slider navPadding={navPadding}>
          <SliderHandlePrev
            backgroundColor={backgroundColor}
            spaceBetween={spaceBetween}
            width={navPadding}
            disabled={this.state.scroll === 0}
          >
            {this.props.renderHandlePrev({
              goToPrev: this.goToPrev,
              disabled: this.state.scroll === 0,
            })}
          </SliderHandlePrev>
          <SliderHandleNext
            backgroundColor={backgroundColor}
            spaceBetween={spaceBetween}
            width={navPadding}
            disabled={!this.canGoToNext()}
          >
            {this.props.renderHandleNext({
              goToNext: this.goToNext,
              disabled: !this.canGoToNext(),
            })}
          </SliderHandleNext>
          <SliderInner
            speedSlide={speedSlide}
            spaceBetween={spaceBetween}
            x={this.state.scroll}
            innerRef={r => {
              this.sliderInnerRef = r;
            }}
          >
            {items.map((item, index) => (
              <SliderItem
                speedMove={speedMove}
                spaceBetween={spaceBetween}
                width={itemWidth}
                widthPercent={itemWidthPercent}
                scaleActiveBy={scaleActiveBy}
                translateLeft={Number.isInteger(this.state.active) && this.state.active > index}
                translateRight={Number.isInteger(this.state.active) && this.state.active < index}
                firstIsActive={firstIsActive}
                lastIsActive={lastIsActive}
                isActive={this.state.active === index}
                index={index}
              >
                {this.props.renderItem({
                  item,
                  index,
                  speedMove,
                  scaleActiveBy,
                  spaceBetween: spaceBetween,
                  width: itemWidth,
                  widthPercent: itemWidthPercent,
                  active: this.state.active === index,
                  setActive: () => this.setActive(index),
                  removeActive: this.removeActive,
                  toggleActive: () => this.toggleActive(index),
                })}
              </SliderItem>
            ))}
          </SliderInner>
        </Slider>
      </React.Fragment>
    );
  }
}
Lolomo.defaultProps = {
  backgroundColor: 'black',
  items: [],
  itemsPerSlide: 8,
  scaleActiveBy: 2,
  spaceBetween: 4,
  navPadding: 80,
  speedSlide: 900,
  speedMove: 450,
  hoverTimeout: 500,
  renderItem: ItemDefaultRendered,
  renderHandlePrev: ({ goToPrev, ...p }) => (
    <SliderHandleDefault {...p} onClick={goToPrev}>
      <i className={`fa fa-chevron-left`} aria-hidden="true" />
    </SliderHandleDefault>
  ),
  renderHandleNext: ({ goToNext, ...p }) => (
    <SliderHandleDefault {...p} onClick={goToNext}>
      <i className={`fa fa-chevron-right`} aria-hidden="true" />
    </SliderHandleDefault>
  ),
};

const Slider = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  padding: 0 ${({ navPadding }) => navPadding}px;
`;
const SliderInner = styled.div`
  white-space: nowrap;
  transition: transform ${({ speedSlide }) => speedSlide}ms cubic-bezier(0.5, 0, 0.1, 1);
  transform: translate3d(${({ x = 0 }) => x}px, 0, 0);
  backface-visibility: hidden;
  overflow-x: visible;
  margin: 0 -${({ spaceBetween }) => spaceBetween}px;
`;
const SliderHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${({ width }) => width}px;
  cursor: pointer;
  z-index: 1;
`;
const SliderHandlePrev = styled(SliderHandle)`
  left: 0;
  margin-left: -${({ spaceBetween }) => spaceBetween * 2}px;
  background-image: linear-gradient(
    to left,
    transparent,
    ${({ backgroundColor }) => backgroundColor}
  );
`;
const SliderHandleNext = styled(SliderHandle)`
  right: 0;
  margin-right: -${({ spaceBetween }) => spaceBetween * 2}px;
  background-image: linear-gradient(
    to right,
    transparent,
    ${({ backgroundColor }) => backgroundColor}
  );
`;
const SliderHandleDefault = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: background-color 200ms ease;
  color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 100%;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  ${({ disabled }) =>
    disabled &&
    `
    color: transparent;
    background-color: transparent;
  `};
`;
/*
background-color: rgba(0, 0, 0, 0.7);
&:hover {
	background-color: rgba(0, 0, 0, 0.4);
}
*/
const SliderItem = styled.div`
  display: inline-flex;
  position: relative;
  white-space: normal;
  vertical-align: top;
  position: relative;
  transition: transform ${({ speedMove }) => speedMove}ms cubic-bezier(0.5, 0, 0.1, 1),
    max-width ${({ speedMove }) => speedMove}ms cubic-bezier(0.5, 0, 0.1, 1);
  width: 100%;
  max-width: ${({ widthPercent }) => widthPercent}%;
  padding: 0 ${({ spaceBetween }) => spaceBetween}px;
  ${({
    translateLeft,
    translateRight,
    firstIsActive,
    lastIsActive,
    isActive,
    index,
    width,
    widthPercent,
    scaleActiveBy,
  }) => {
    let transform = '';
    if (translateLeft) {
      if (firstIsActive) {
        transform += `
        transform: translate3d(0, 0, 0);
        `;
      } else if (lastIsActive) {
        transform += `
        transform: translate3d(-${width * (scaleActiveBy - 1)}px, 0, 0);
        `;
      } else {
        transform += `
        transform: translate3d(-${(width * (scaleActiveBy - 1)) / 2}px, 0, 0);
        `;
      }
    }
    if (translateRight) {
      if (lastIsActive) {
        transform += `
        transform: translate3d(0, 0, 0);
        `;
      } else if (firstIsActive) {
        transform += `
          transform: translate3d(${width * (scaleActiveBy - 1)}px, 0, 0);
          `;
      } else {
        transform += `
          transform: translate3d(${(width * (scaleActiveBy - 1)) / 2}px, 0, 0);
        `;
      }
    }

    /*
    if (translateLeft) {
      if (firstIsActive) {
        transform += `
        transform: translate3d(0, 0, 0);
        `;
      } else if (lastIsActive) {
        transform += `
        transform: translate3d(-${2 * itemActivePadding}px, 0, 0);
        `;
      } else {
        transform += `
        transform: translate3d(-${itemActivePadding}px, 0, 0);
        `;
      }
    }
    if (translateRight) {
      if (lastIsActive) {
        transform += `
        transform: translate3d(0, 0, 0);
        `;
      } else if (firstIsActive) {
        transform += `
          transform: translate3d(${2 * itemActivePadding}px, 0, 0);
          `;
      } else {
        transform += `
          transform: translate3d(${itemActivePadding}px, 0, 0);
        `;
      }
    }
    if (isActive) {
      transform += `
        max-width: ${+widthPercent * +scaleActiveBy}%;
      `;
    }
    */
    return transform;
  }};
`;
