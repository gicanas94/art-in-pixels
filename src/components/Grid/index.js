import { Eraser as EraseIcon } from 'styled-icons/boxicons-solid';
import { exportComponentAsPNG } from 'react-component-export-image';

import {
  Fullscreen as ResetTransformIcon,
  Paint as DrawIcon,
} from 'styled-icons/boxicons-regular';

import { GridOn as GridIcon } from 'styled-icons/material-sharp';
import PropTypes from 'proptypes';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import * as CONSTANTS from '../../constants';
import ActionButton from './ActionButton';

const StyledWrapper = styled.div`
  height: 100vh;
  position: relative;
  width: 100%;

  .react-transform-component {
    cursor: move;
    height: 100%;
    overflow: auto;
    width: 100%;

    ::-webkit-scrollbar {
      background-color: #141322;
      height: 20px;
      width: 20px;
    }

    ::-webkit-scrollbar-corner {
      background-color: #141322;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #feafff;
    }
  }

  .react-transform-element {
    padding: 150px;
  }

  .grid {
    cursor: cell;
  }

  .pixel {
    &:hover {
      border: 0.5px solid
        ${({ mode }) => (mode === CONSTANTS.MODES.DRAW ? '#ffffff' : '#ff0000')} !important;
    }
  }
`;

const StyledActions = styled.div`
  background-color: #141322;
  display: flex;
  padding: 5px;
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  z-index: 10;

  & > *:not(:last-of-type) {
    margin-right: 5px;
  }
`;

const StyledDrawIcon = styled(DrawIcon)`
  height: 40px;
  width: 40px;
`;

const StyledEraseIcon = styled(EraseIcon)`
  height: 40px;
  padding-top: 2px;
  width: 40px;
`;

const StyledResetTransformIcon = styled(ResetTransformIcon)`
  height: 40px;
  width: 40px;
`;

const StyledGridIcon = styled(GridIcon)`
  height: 40px;
  width: 40px;
`;

const StyledGrid = styled.span`
  display: grid;

  ${({ columns, pixelSize }) => `
    grid-template-columns: repeat(${columns}, minmax(min-content, ${`${pixelSize}px`}));
  `}
`;

const StyledPixel = styled.div`
  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

const Grid = ({
  backgroundColor,
  gridColor,
  columns,
  exportForWebHandler,
  mode,
  onGridMouseMoveHandler,
  onPixelClickHandler,
  pixelMapping,
  pixelSize,
  setMode,
}) => {
  const [gridIsVisible, setGridIsVisible] = useState(true);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const gridRef = useRef();

  const gridElement = (
    <StyledGrid
      columns={columns}
      className="grid"
      onMouseDown={() => setMouseIsDown(true)}
      onMouseMove={mouseIsDown ? onGridMouseMoveHandler : null}
      onMouseLeave={() => setMouseIsDown(false)}
      onMouseUp={() => setMouseIsDown(false)}
      ref={gridRef}
      pixelSize={pixelSize}
    >
      {pixelMapping.map((pixel) => (
        <StyledPixel
          gridColor={gridColor}
          className="pixel"
          id={pixel.id}
          key={pixel.id}
          onClick={() => onPixelClickHandler(pixel.id)}
          style={{
            ...pixel.style,
            border: gridIsVisible ? `0.5px dashed ${gridColor}` : '0',
          }}
        />
      ))}
    </StyledGrid>
  );

  return (
    <StyledWrapper mode={mode} style={{ backgroundColor }}>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        id="export-for-web-button"
        onClick={() => exportForWebHandler(gridElement)}
        style={{ display: 'none' }}
        type="button"
      />

      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        id="export-as-png-button"
        onClick={() =>
          exportComponentAsPNG(gridRef, CONSTANTS.EXPORT_FILENAME.IMAGE)
        }
        style={{ display: 'none' }}
        type="button"
      />

      <TransformWrapper
        defaultScale={1}
        doubleClick={{
          disabled: true,
        }}
        options={{
          centerContent: false,
          limitToWrapper: true,
          maxScale: 5,
          minScale: 0.4,
        }}
        pan={{
          disableOnTarget: ['actions', 'pixel'],
        }}
        pinch={{
          disabled: true,
        }}
        scalePadding={{
          disabled: false,
        }}
        wheel={{
          step: 10,
        }}
      >
        {({ resetTransform }) => (
          <>
            <StyledActions className="actions">
              <ActionButton
                id="reset-transform-button"
                label="Reset zoom"
                onClick={resetTransform}
              >
                <StyledResetTransformIcon />
              </ActionButton>

              <ActionButton
                label="Show/Hide grid"
                onClick={() => setGridIsVisible(!gridIsVisible)}
                selectable
                selected={gridIsVisible}
              >
                <StyledGridIcon />
              </ActionButton>

              <ActionButton
                onClick={() => setMode(CONSTANTS.MODES.DRAW)}
                label="Draw"
                selectable
                selected={mode === CONSTANTS.MODES.DRAW}
              >
                <StyledDrawIcon />
              </ActionButton>

              <ActionButton
                onClick={() => setMode(CONSTANTS.MODES.ERASE)}
                label="Erase"
                selectable
                selected={mode === CONSTANTS.MODES.ERASE}
              >
                <StyledEraseIcon />
              </ActionButton>
            </StyledActions>

            <TransformComponent>{gridElement}</TransformComponent>
          </>
        )}
      </TransformWrapper>
    </StyledWrapper>
  );
};

Grid.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  columns: PropTypes.number.isRequired,
  exportForWebHandler: PropTypes.func.isRequired,
  gridColor: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onGridMouseMoveHandler: PropTypes.func.isRequired,
  onPixelClickHandler: PropTypes.func.isRequired,
  pixelMapping: PropTypes.arrayOf(PropTypes.object),
  pixelSize: PropTypes.number.isRequired,
  setMode: PropTypes.func.isRequired,
};

Grid.defaultProps = {
  pixelMapping: [],
};

export default Grid;
