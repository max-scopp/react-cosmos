import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getRendererCoreMethods,
  getRouterContext,
  mockNotifications,
  mockRouter,
} from '../../../testHelpers/pluginMocks.js';
import {
  mockFixtureStateChange,
  mockRendererReady,
} from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtureId = { path: 'zwei.js' };

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => fixtureId,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1');
  mockFixtureStateChange('mockRendererId1', fixtureId, { props: [] });
}

function emitRouterFixtureSelect() {
  getRouterContext().emit('fixtureSelect', fixtureId);
}

function emitRouterFixtureReselect() {
  getRouterContext().emit('fixtureReselect', fixtureId);
}

function getFixtureState() {
  return getRendererCoreMethods().getFixtureState();
}

it('resets fixture state on select', async () => {
  registerTestPlugins();
  loadTestPlugins();

  emitRouterFixtureSelect();
  await waitFor(() => expect(getFixtureState()).toEqual({}));
});

it('does not reset fixture state on reselect', async () => {
  registerTestPlugins();
  loadTestPlugins();

  emitRouterFixtureReselect();
  await waitFor(() => expect(getFixtureState()).toEqual({ props: [] }));
});
