import { StateMock } from '@react-mock/state';
import retry from '@skidding/async-retry';
import until from 'async-until';
import delay from 'delay';
import React from 'react';
import { FixtureStatePrimitiveValue } from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { testFixtureLoader } from '../testHelpers';
import { Counter } from '../testHelpers/components';
import { getClassState } from '../testHelpers/fixtureState';

let counterRef: null | Counter = null;
beforeEach(() => {
  counterRef = null;
});

const rendererId = uuid();
const getFixtures = () => ({
  first: (
    <StateMock state={{ count: 5 }}>
      <Counter
        ref={elRef => {
          if (elRef) {
            counterRef = elRef;
          }
        }}
      />
    </StateMock>
  )
});
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'captures component state changes',
  { rendererId, fixtures: getFixtures() },
  async ({ selectFixture, getLastFixtureState }) => {
    await selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {}
    });
    await until(() => counterRef);
    counterRef!.setState({ count: 7 });
    await retry(async () => expect(await getCount()).toBe(7));

    // Simulate a small pause between updates
    await delay(500);

    counterRef!.setState({ count: 13 });
    await retry(async () => expect(await getCount()).toBe(13));

    async function getCount(): Promise<null | number> {
      const fixtureState = await getLastFixtureState();
      const [{ values }] = getClassState(fixtureState);
      if (!values) return null;
      const countValue = values.count as FixtureStatePrimitiveValue;
      return countValue.value as number;
    }
  }
);
