import { createGlobalStyle } from 'styled-components';

import MinecraftFont from '../assets/fonts/Minecraft.ttf';

export default createGlobalStyle`
  @font-face {
    font-family: 'Minecraft';
    src: url(${MinecraftFont});
  }

  * {
    box-sizing: border-box;
  }

  html {}

  body {
    background-color: #141322;
    color: #feafff;
    font-family: 'Minecraft';
    font-size: 18px;
    margin: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-size: 1em;
  }

  p {
    margin: 0;
  }

  ::selection {
    background-color: #feafff;
    color: #141322;
  }
`;
