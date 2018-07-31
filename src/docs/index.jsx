import React from 'react';
import { render } from 'react-dom';
import Lolomo from '../../lib';
import './styles.css';
import randomcolor from 'randomcolor';

const getList = (n = 50) => Array.from({ length: n }).map(() => ({ color: randomcolor() }));
const LISTS = Array.from({ length: 10 }).map(() => getList());
const Lists = () =>
  LISTS.map(array => (
    <React.Fragment>
      <Lolomo items={array} spaceBetween={2} />
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

render(<Demo />, document.getElementById('app'));
