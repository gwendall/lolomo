import React from 'react';
import { render } from 'react-dom';
import Lolomo from '../../lib';
import './styles.css';
import randomcolor from 'randomcolor';
import styled from 'styled-components';

const getList = (n = 50) => Array.from({ length: n }).map(() => ({ color: randomcolor() }));
const LISTS = Array.from({ length: 10 }).map(() => getList());
const Lists = () =>
  LISTS.map(array => (
    <React.Fragment>
      <Lolomo
        backgroundColor="#eee"
        items={array}
        spaceBetween={2}
        renderItem={({ item: { color }, index }) => (
          <Item style={{ backgroundColor: color }}>{index}</Item>
        )}
      />
      <div style={{ height: 40 }} />
    </React.Fragment>
  ));

function Demo() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>React Lolomo</h1>
      <Lists />
    </div>
  );
}

const Item = styled.div`
  flex: 1;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  cursor: pointer;
`;

render(<Demo />, document.getElementById('app'));
