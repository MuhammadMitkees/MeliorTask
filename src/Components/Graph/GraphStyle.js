import styled from "@emotion/styled";

export const MainDiv = styled.div`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    margin: 50px auto;
    font-family: "Khand";
    font-size: 1.2em;
    text-align: center;
  }

  ul {
    padding-top: 20px;
    display: flex;
    gap: 2rem;
  }

  li {
    margin: 0.5rem 0;
  }

  legend {
    margin: 0 auto;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
`;
