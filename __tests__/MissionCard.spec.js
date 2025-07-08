// __tests__/MissionCard.spec.js

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MissionCard from '../src/components/ui/MissionCard.vue';

// ✅ Mock RouterLink supaya tidak error navigasi
const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: `<a :href="to"><slot /></a>`,
};

// ✅ Mock useAuthStore Pinia
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from '@/stores/auth';

describe('MissionCard.vue', () => {
  let mission;

  beforeEach(() => {
    setActivePinia(createPinia());

    mission = {
      id: 'MID-123',
      title: 'Tes Misi Rahasia',
      description:
        'Deskripsi panjang sekali yang harusnya terpotong jika melebihi batas karakter tertentu.',
      bounty: 50000,
      deadline: '2025-08-01',
      status: 'assigned',
      requiredSkills: ['Menyelinap', 'Berpikir cepat'],
    };
  });

  function mockAuth(role = null, isAuthenticated = false) {
    useAuthStore.mockReturnValue({
      user: { role },
      isAuthenticated,
    });
  }

  it('renders mission card correctly with available mission data', () => {
    mockAuth();
    const wrapper = mount(MissionCard, {
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
      props: { mission },
    });

    expect(wrapper.text()).toContain(mission.title);
    expect(wrapper.find('.bounty').text()).toContain('50.000');
  });

  it('truncates long mission description', () => {
    mockAuth();
    // Buat deskripsi panjang melebihi 150 karakter
    mission.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(5);

    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    const descriptionText = wrapper.find('.mission-description').text();
    expect(descriptionText.endsWith('...')).toBe(true);
    expect(descriptionText.length).toBeLessThanOrEqual(153);
  });

  it('formats the bounty correctly', () => {
    mockAuth();
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    expect(wrapper.find('.bounty').text()).toBe('50.000');
  });

  it('formats the deadline correctly', () => {
    mockAuth();
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    const deadlineText = wrapper.find('.deadline').text();
    expect(deadlineText).toMatch(/\d{1,2} [A-Za-z]{3} 2025/); // Format e.g. "1 Agu 2025"
  });

  it('displays correct status and class for "assigned" mission', () => {
    mockAuth();
    mission.status = 'assigned';
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    const statusEl = wrapper.find('.mission-status');
    expect(statusEl.text()).toBe('Ditugaskan');
    expect(statusEl.classes()).toContain('status-assigned');
  });

  it('displays correct status and class for "completed" mission', () => {
    mockAuth();
    mission.status = 'completed';
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    const statusEl = wrapper.find('.mission-status');
    expect(statusEl.text()).toBe('Selesai');
    expect(statusEl.classes()).toContain('status-completed');
  });

  it('renders requiredSkills if provided', () => {
    mockAuth();
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    mission.requiredSkills.forEach((skill) => {
      expect(wrapper.text()).toContain(skill);
    });
  });

  it('renders content passed through the #actions slot', () => {
    mockAuth();
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
      slots: {
        actions: '<button class="test-action">Action Button</button>',
      },
    });

    expect(wrapper.find('.test-action').exists()).toBe(true);
  });

  it('detail link points to client mission detail path when user is client', () => {
    mockAuth('client', true);
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    const link = wrapper.findComponent(RouterLinkStub);
    expect(link.props('to')).toBe(`/client/missions/${mission.id}`);
  });

  it('detail link points to ninja mission detail path when user is ninja', () => {
    mockAuth('ninja', true);
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    const link = wrapper.findComponent(RouterLinkStub);
    expect(link.props('to')).toBe(`/ninja/missions/${mission.id}`);
  });

  it('detail link points to public mission detail path when user is not authenticated', () => {
    mockAuth(null, false);
    const wrapper = mount(MissionCard, {
      global: { stubs: { RouterLink: RouterLinkStub } },
      props: { mission },
    });

    const link = wrapper.findComponent(RouterLinkStub);
    expect(link.props('to')).toBe(`/missions/${mission.id}`);
  });
});
