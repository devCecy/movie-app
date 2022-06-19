import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import App from "./App";
import { theme } from "./theme";

/**
 * 글로벌 스타일 적용
 */
const GlobalStyle = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300&family=Noto+Sans+KR:wght@300&display=swap');
   html,
   body,
   div,
   span,
   applet,
   object,
   iframe,
   h1,
   h2,
   h3,
   h4,
   h5,
   h6,
   p,
   blockquote,
   pre,
   a,
   abbr,
   acronym,
   address,
   big,
   cite,
   code,
   del,
   dfn,
   em,
   img,
   ins,
   kbd,
   q,
   s,
   samp,
   small,
   strike,
   strong,
   sub,
   sup,
   tt,
   var,
   b,
   u,
   i,
   center,
   dl,
   dt,
   dd,
   menu,
   ol,
   ul,
   li,
   fieldset,
   form,
   label,
   legend,
   table,
   caption,
   tbody,
   tfoot,
   thead,
   tr,
   th,
   td,
   article,
   aside,
   canvas,
   details,
   embed,
   figure,
   figcaption,
   footer,
   header,
   hgroup,
   main,
   menu,
   nav,
   output,
   ruby,
   section,
   summary,
   time,
   mark,
   audio,
   video {
     margin: 0;
     padding: 0;
     border: 0;
     font-size: 100%;
     font: inherit;
     vertical-align: baseline;
   }
   /* HTML5 display-role reset for older browsers */
   article,
   aside,
   details,
   figcaption,
   figure,
   footer,
   header,
   hgroup,
   main,
   menu,
   nav,
   section {
     display: block;
   }
   /* HTML5 hidden-attribute fix for newer browsers */
   *[hidden] {
     display: none;
   }
   body {
     line-height: 1;
   }
   menu,
   ol,
   ul {
     list-style: none;
   }
   blockquote,
   q {
     quotes: none;
   }
   blockquote:before,
   blockquote:after,
   q:before,
   q:after {
     content: '';
     content: none;
   }
   table {
     border-collapse: collapse;
     border-spacing: 0;
   }
 
   *{
     box-sizing: border-box;
   }
 
   body {
     font-family: 'Mukta', sans-serif;
     background-color: white;
     color: black;
     height: 200vh; // TODO: 삭제
     
   }

   a{
     text-decoration: none;
     /* 부모컬러 상속 */
     color: inherit; 
     }
 
     button{
     cursor:pointer;
     }
 `;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
