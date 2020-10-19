import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import styled, { ServerStyleSheet } from 'styled-components';

import * as CONSTANTS from './constants';
import { Button, ColorPicker, Grid, Hr, Input } from './components';

const StyledOnlyLaptop = styled.div`
  background-color: #141322;
  padding: 20px;

  @media (min-width: 992px) {
    display: none;
  }
`;

const StyledOnlyLaptopTitle = styled.h1`
  font-size: 3em;
  margin-bottom: 20px;
`;

const StyledOnlyLaptopSubtitle = styled.p``;

const StyledApp = styled.div`
  display: none;

  @media (min-width: 992px) {
    display: flex;
  }
`;

const StyledMenu = styled.div`
  background-color: #141322;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  min-width: 250px;
  max-width: 250px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 20px;
  z-index: 10;

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 0px;
  }
`;

const StyledWelcome = styled.div``;

const StyledWelcomeTitle = styled.h1`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const StyledWelcomeInfo = styled.div`
  font-size: 0.7em;
  line-height: 1.3;
  margin-bottom: 10px;
`;

const StyledGitHubLink = styled.a`
  font-size: 0.7em;
`;

const StyledLabel = styled.div`
  font-size: 1em;
  margin-bottom: 10px;
`;

const StyledSubLabel = styled.div`
  font-size: 0.7em;
  margin-bottom: 3px;
`;

const StyledNewGridForm = styled.form``;

const StyledNewGridFormInputs = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 20px;
  text-align: center;
`;

const StyledDrawingColors = styled.div`
  margin-bottom: 20px;
`;

const StyledGridColors = styled.div``;

const StyledColors = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

const StyledExport = styled.div`
  button:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

// ---------------------------------------------------------------------------

const App = () => {
  const [drawingColors, setDrawingColors] = useState(
    JSON.parse(localStorage.getItem('drawingColors')) ||
      CONSTANTS.DEFAULT_COLORS,
  );

  const [grid, setGrid] = useState(
    JSON.parse(localStorage.getItem('grid')) || CONSTANTS.DEFAULT_GRID_SETUP,
  );

  const [gridBackgroundColor, setGridBackgroundColor] = useState(
    JSON.parse(localStorage.getItem('gridBackgroundColor')) ||
      CONSTANTS.DEFAULT_GRID_BACKGROUND_COLOR,
  );

  const [gridColor, setGridColor] = useState(
    JSON.parse(localStorage.getItem('gridColor')) ||
      CONSTANTS.DEFAULT_GRID_COLOR,
  );

  const [mode, setMode] = useState(CONSTANTS.MODES.DRAW);

  const [newGridFormValues, setNewGridFormValues] = useState(
    JSON.parse(localStorage.getItem('grid')) || CONSTANTS.DEFAULT_GRID_SETUP,
  );

  const [selectedDrawingColor, setSelectedDrawingColor] = useState(
    drawingColors[0],
  );

  // ---------------------------------------------------------------------------

  const createNewPixelMapping = (properties) =>
    Array.from(
      { length: properties.columns * properties.rows },
      (_, index) => ({
        id: index,
        style: {
          background: 'transparent',
        },
      }),
    );

  const exportForWeb = (artwork) => {
    const sheet = new ServerStyleSheet();

    try {
      const html = renderToStaticMarkup(sheet.collectStyles(artwork))
        .replaceAll(CONSTANTS.REMOVE_ID_FROM_ARTWORK_REGEX, '')
        .replaceAll(' pixel', '');

      const styleTags = sheet.getStyleTags();

      const blob = new Blob([`<div>${styleTags + html}</div>`], {
        type: 'text/html;charset=utf-8',
      });

      let downloadLink = document.createElement('a');
      downloadLink.setAttribute('id', 'downloadLink');

      if (window?.navigator?.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(
          blob,
          `${CONSTANTS.EXPORT_FILENAME.WEB}.html`,
        );
      } else {
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${CONSTANTS.EXPORT_FILENAME.WEB}.html`;
        document.body.appendChild(downloadLink);
        document.getElementById('downloadLink').click();
        downloadLink.remove();
        downloadLink = undefined;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error trying to export your artwork for web', error);
    } finally {
      sheet.seal();
    }
  };

  const handleDrawingColorChange = (drawingColor, index) => {
    const newDrawingColors = [...drawingColors];
    newDrawingColors[index] = drawingColor;
    setSelectedDrawingColor(drawingColor);
    setDrawingColors(newDrawingColors);
    setMode(CONSTANTS.MODES.DRAW);
    localStorage.setItem('drawingColors', JSON.stringify(newDrawingColors));
  };

  const handleGridBackgroundColorChange = (color) => {
    setGridBackgroundColor(color);
    localStorage.setItem('gridBackgroundColor', JSON.stringify(color));
  };

  const handleGridColorChange = (color) => {
    setGridColor(color);
    localStorage.setItem('gridColor', JSON.stringify(color));
  };

  const handleNewGridFormSubmit = (event) => {
    event.preventDefault();

    const newGrid = {
      ...newGridFormValues,
      pixelMapping: createNewPixelMapping(newGridFormValues),
    };

    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'The current grid will be cleaned, are you sure you want to continue?',
      )
    ) {
      setGrid(newGrid);
      setMode(CONSTANTS.MODES.DRAW);
      localStorage.setItem('grid', JSON.stringify(newGrid));
      document.getElementById('reset-transform-button').click();
    }
  };

  const handleNewGridFormChange = (field, value) => {
    setNewGridFormValues({ ...newGridFormValues, [field]: value });
  };

  const handlePixelClick = (id) => {
    if (
      (mode === CONSTANTS.MODES.ERASE &&
        grid.pixelMapping.find((pixel) => pixel.id === id).style.background ===
          'transparent') ||
      (mode === CONSTANTS.MODES.DRAW &&
        grid.pixelMapping.find((pixel) => pixel.id === id).style.background ===
          selectedDrawingColor)
    ) {
      return;
    }

    const newPixelMapping = grid.pixelMapping.map((pixel) =>
      pixel.id === id
        ? {
            ...pixel,
            style: {
              background:
                mode === CONSTANTS.MODES.DRAW
                  ? selectedDrawingColor
                  : 'transparent',
            },
          }
        : pixel,
    );

    const newGrid = { ...grid, pixelMapping: newPixelMapping };

    setGrid(newGrid);
    localStorage.setItem('grid', JSON.stringify(newGrid));
  };

  const handleGridMouseMove = (event) => {
    handlePixelClick(Number(event.target.id));
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!localStorage.getItem('grid')) {
      setGrid({ ...grid, pixelMapping: createNewPixelMapping(grid) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------

  return (
    <>
      <StyledOnlyLaptop>
        <StyledOnlyLaptopTitle>Sorry...</StyledOnlyLaptopTitle>

        <StyledOnlyLaptopSubtitle>
          Given the nature of this application, it is not available for your
          screen resolution.
          <br />
          <br />
          Minimum resolution required: 992px
        </StyledOnlyLaptopSubtitle>
      </StyledOnlyLaptop>

      <StyledApp>
        <StyledMenu>
          {/* Welcome */}
          <StyledWelcome>
            <StyledWelcomeTitle>Art in Pixels</StyledWelcomeTitle>

            <StyledWelcomeInfo>
              Welcome! Your work, as well as your colors and settings, is
              automatically saved in your browser storage with every change you
              make.
            </StyledWelcomeInfo>

            <StyledGitHubLink
              href="https://github.com/gicanas94/art-in-pixels/"
              target="_blank"
            >
              View on GitHub
            </StyledGitHubLink>
          </StyledWelcome>

          <Hr margin="10px 0" />

          {/* New grid form */}
          <StyledNewGridForm onSubmit={handleNewGridFormSubmit}>
            <StyledLabel>New grid</StyledLabel>

            <StyledNewGridFormInputs>
              <div>
                <StyledSubLabel>Columns</StyledSubLabel>

                <Input
                  min="2"
                  max="100"
                  onChange={(event) =>
                    handleNewGridFormChange(
                      'columns',
                      Number(event.target.value),
                    )
                  }
                  required
                  type="number"
                  value={newGridFormValues.columns}
                />
              </div>

              <div>
                <StyledSubLabel>Rows</StyledSubLabel>

                <Input
                  min="2"
                  max="100"
                  onChange={(event) =>
                    handleNewGridFormChange('rows', Number(event.target.value))
                  }
                  required
                  type="number"
                  value={newGridFormValues.rows}
                />
              </div>

              <div>
                <StyledSubLabel>Pixel size</StyledSubLabel>

                <Input
                  min="1"
                  max="80"
                  onChange={(event) =>
                    handleNewGridFormChange(
                      'pixelSize',
                      Number(event.target.value),
                    )
                  }
                  required
                  type="number"
                  value={newGridFormValues.pixelSize}
                />
              </div>
            </StyledNewGridFormInputs>

            <Button color="#3eb679" styleType="bordered" type="submit">
              CREATE
            </Button>
          </StyledNewGridForm>

          <Hr margin="10px 0" />

          {/* Drawing colors */}
          <StyledDrawingColors>
            <StyledLabel>Drawing colors</StyledLabel>

            <StyledColors>
              {drawingColors.map((color, index) => (
                <ColorPicker
                  color={color}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  onChange={(event) =>
                    handleDrawingColorChange(event.target.value, index)
                  }
                  onSelect={(c) => {
                    setMode(CONSTANTS.MODES.DRAW);
                    setSelectedDrawingColor(c);
                  }}
                  selected={color === selectedDrawingColor}
                />
              ))}
            </StyledColors>
          </StyledDrawingColors>

          {/* Grid colors */}
          <StyledGridColors>
            <StyledLabel>Grid colors</StyledLabel>

            <StyledColors>
              <div>
                <StyledSubLabel>BG</StyledSubLabel>

                <ColorPicker
                  color={gridBackgroundColor}
                  onChange={(event) =>
                    handleGridBackgroundColorChange(event.target.value)
                  }
                />
              </div>

              <div>
                <StyledSubLabel>Grid</StyledSubLabel>

                <ColorPicker
                  color={gridColor}
                  onChange={(event) =>
                    handleGridColorChange(event.target.value)
                  }
                />
              </div>
            </StyledColors>
          </StyledGridColors>

          <Hr margin="10px 0" />

          {/* Export */}
          <StyledExport>
            <StyledLabel>Export</StyledLabel>

            <Button
              color="#8ecbfb"
              onClick={() =>
                document.getElementById('export-for-web-button').click()
              }
              styleType="bordered"
            >
              FOR WEB - HTML
            </Button>

            <Button
              color="#e29f5e"
              onClick={() =>
                document.getElementById('export-as-png-button').click()
              }
              styleType="bordered"
            >
              AS IMAGE - PNG
            </Button>
          </StyledExport>
        </StyledMenu>

        <Grid
          backgroundColor={gridBackgroundColor}
          gridColor={gridColor}
          columns={grid.columns}
          exportForWebHandler={exportForWeb}
          mode={mode}
          onGridMouseMoveHandler={handleGridMouseMove}
          onPixelClickHandler={handlePixelClick}
          pixelMapping={grid.pixelMapping}
          pixelSize={grid.pixelSize}
          setMode={setMode}
        />
      </StyledApp>
    </>
  );
};

export default App;
