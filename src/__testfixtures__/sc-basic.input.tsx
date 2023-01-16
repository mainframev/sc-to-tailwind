import styled from "styled-components";
import React from "react";

const BasicStyles = styled.div`
  font-size: 20px;
  text-transform: uppercase;
  line-height: 24px;
  padding: 1rem;
  margin: 2rem 0;
  box-sizing: border-box;
  background-color: #fed7d7;
  color: red;
  &:hover {
    background: #ccc;
    color: #000;
  }
`;

const SomeComponent = styled.span`
  padding: 20px 30px;
  color: #ccc;
  border-top: 1px solid #ccc;
  border-bottom: 2px solid #808080;
  border-left: 3px solid #ef8732;
  border-right: 4px solid #fe3213;
  background: blue;
  display: block;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid blue;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  &:after {
    display: block;
    position: absolute;
    top: 0;
    background: red;
    height: 1px;
    left: 0;
    width: 100%;
  }
`;

const Component = () => (
  <Wrapper>
    <BasicStyles>kek</BasicStyles>
    <SomeComponent>bur</SomeComponent>
    <SomeComponent>bur</SomeComponent>
    <SomeComponent>bur</SomeComponent>
    <SomeComponent>bur</SomeComponent>
  </Wrapper>
);

export default Component;
