import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import {
  computed,
  nextTick,
  onScopeDispose,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';
import { CENTER_EUROPE } from '~/lib/constants';

const flyTo = vi.fn();
const fitBounds = vi.fn();

class MockLngLatBounds {
  points: Array<[number, number]> = [];

  constructor(sw: [number, number], ne: [number, number]) {
    this.points.push(sw, ne);
  }

  extend(point: [number, number]) {
    this.points.push(point);
    return this;
  }
}

vi.mock('maplibre-gl', () => ({
  LngLatBounds: MockLngLatBounds,
}));

vi.mock('@indoorequal/vue-maplibre-gl', () => ({
  useMap: () => ({
    map: {
      flyTo,
      fitBounds,
    },
  }),
}));

describe('map store integration', () => {
  async function createStore() {
    Object.assign(globalThis, {
      computed,
      defineStore: (await import('pinia')).defineStore,
      onScopeDispose,
      ref,
      shallowRef,
      watch,
      watchEffect,
    });

    const { useMapStore } = await import('../stores/map');
    return useMapStore();
  }

  beforeEach(() => {
    setActivePinia(createPinia());
    flyTo.mockReset();
    fitBounds.mockReset();
  });

  it('handles map centering and bounds updates', async () => {
    const store = await createStore();
    await store.init();
    await nextTick();

    expect(flyTo).toHaveBeenCalledWith({
      center: CENTER_EUROPE,
      zoom: 2,
    });

    store.mapPoints = [
      { id: 1, name: 'Kyiv', description: null, lat: 50.45, long: 30.52 },
      { id: 2, name: 'Lviv', description: null, lat: 49.84, long: 24.03 },
    ];
    await nextTick();

    expect(fitBounds).toHaveBeenCalledTimes(1);
    expect(fitBounds).toHaveBeenCalledWith(expect.any(MockLngLatBounds), {
      padding: 60,
      maxZoom: 12,
    });
  });

  it('flies to selected point and handles new point updates', async () => {
    const store = await createStore();
    await store.init();
    await nextTick();
    flyTo.mockClear();

    store.mapPoints = [
      { id: 1, name: 'Kyiv', description: null, lat: 50.45, long: 30.52 },
    ];
    store.selectedPointId = 1;
    await nextTick();

    expect(flyTo).toHaveBeenCalledWith({
      center: [30.52, 50.45],
      zoom: 6,
      speed: 0.5,
    });

    flyTo.mockClear();
    store.selectedPointWithFlyTo({
      id: 1,
      name: 'Kyiv',
      description: null,
      lat: 50.45,
      long: 30.52,
    });
    await nextTick();

    expect(flyTo).not.toHaveBeenCalled();

    store.newPoint = {
      id: 10,
      name: 'Odesa',
      description: null,
      lat: 46.48,
      long: 30.72,
      zoom: 9,
    };
    await nextTick();

    expect(flyTo).toHaveBeenCalledWith({
      center: [30.72, 46.48],
      speed: 0.5,
      zoom: 9,
    });
  });
});
