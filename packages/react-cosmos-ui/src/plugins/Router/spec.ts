import { FixtureId, PlaygroundParams } from 'react-cosmos-core';

export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: PlaygroundParams;
  };
  methods: {
    getSelectedFixtureId(): null | FixtureId;
    selectFixture(fixtureId: FixtureId): void;
    unselectFixture(): void;
  };
  events: {
    fixtureSelect(fixtureId: FixtureId): void;
    fixtureReselect(fixtureId: FixtureId): void;
    fixtureUnselect(): void;
  };
};
