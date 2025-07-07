// __tests__/MissionCard.spec.js

// Import utilities from Vitest and Vue Test Utils
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils'; // Use mount for full rendering

// Import utilities from Pinia Testing
import { createTestingPinia } from '@pinia/testing';

// Import component to be tested
import MissionCard from '../src/components/ui/MissionCard.vue';

// Import Pinia Store used by the component
import { useAuthStore } from '../src/stores/auth';

describe('MissionCard.vue', () => {
  // Dummy mission data for testing
  const mockMissionAvailable = {
    id: 1,
    clientId: 101,
    title: 'Network Penetration Test',
    description: 'Perform a comprehensive penetration test on client network infrastructure to identify vulnerabilities.',
    bounty: 5000,
    deadline: '2025-08-15', // Format: YYYY-MM-DD
    requiredSkills: ['Penetration Testing', 'Network Security'],
    status: 'available',
    applicants: [],
    assignedNinjaId: null,
  };

  const mockMissionAssigned = {
    id: 2,
    clientId: 102,
    title: 'Data Recovery from Encrypted Drive',
    description: 'Urgent recovery of critical business data from a corrupted encrypted drive.',
    bounty: 3500,
    deadline: '2025-07-20',
    requiredSkills: ['Digital Forensics', 'Cryptography'],
    status: 'assigned',
    applicants: [201],
    assignedNinjaId: 201,
  };

  const mockMissionCompleted = {
    id: 3,
    clientId: 103,
    title: 'OSINT Gathering - Competitor Analysis',
    description: 'Gather open-source intelligence on competitor\'s new product launch strategies.',
    bounty: 1200,
    deadline: '2025-06-01',
    requiredSkills: ['OSINT'],
    status: 'completed',
    applicants: [202],
    assignedNinjaId: 202,
  };

  let authStore;

  // beforeEach hook runs before each test case
  beforeEach(() => {
    // We don't need to call setActivePinia and createPinia here if we pass it
    // directly to mount options as a plugin.
    // The `authStore` will be initialized within each test's wrapper setup
    // through the `createTestingPinia` plugin.
  });

  // Helper function to mount the component with consistent global options
  const createWrapper = (missionProps, authStateOverrides = {}) => {
    const wrapper = mount(MissionCard, {
      props: {
        mission: missionProps,
      },
      global: {
        plugins: [
          createTestingPinia({
            // Mock initial state for auth store
            initialState: {
              auth: {
                user: authStateOverrides.user || null,
                isAuthenticated: authStateOverrides.isAuthenticated || false,
                userRole: authStateOverrides.userRole || null,
              },
            },
            // We can stub actions if we don't want them to run, but here we
            // directly modify the state, so default stubActions behavior is fine.
          }),
        ],
        // Stub RouterLink to prevent Vue Router errors in tests
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    // Get the mocked authStore instance from the wrapper's vm context
    authStore = useAuthStore();
    return wrapper;
  };

  // Test Case 1: Renders mission card correctly with available mission data
  it('renders mission card correctly with available mission data', () => {
    const wrapper = createWrapper(mockMissionAvailable);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.mission-title').text()).toBe(mockMissionAvailable.title);
    expect(wrapper.find('.mission-description').text()).toContain('Perform a comprehensive penetration test'); // Check truncated
    expect(wrapper.find('.bounty').text()).toBe('$5.000');
    expect(wrapper.find('.mission-status').text()).toBe('Tersedia'); // Check formatted status
    expect(wrapper.find('.mission-status').classes()).toContain('status-available'); // Check status class

    const skillTags = wrapper.findAll('.skill-tag');
    expect(skillTags.length).toBe(mockMissionAvailable.requiredSkills.length);
    expect(skillTags[0].text()).toBe('Penetration Testing');
  });

  // Test Case 2: Truncates long mission description
  it('truncates long mission description', () => {
    const longDescription = 'A very long mission description that definitely exceeds the default truncation limit of 150 characters. This text should be cut short and end with an ellipsis to indicate that there is more content available in the full detail view of the mission.';
    const longDescriptionMission = {
      ...mockMissionAvailable,
      description: longDescription,
    };
    const wrapper = createWrapper(longDescriptionMission);

    const descriptionText = wrapper.find('.mission-description').text();
    expect(descriptionText.length).toBeLessThan(longDescription.length);
    expect(descriptionText).toContain('...');
    // A more precise check would be to know the exact truncation point,
    // but this confirms it's truncated.
  });

  // Test Case 3: Formats the bounty correctly
  it('formats the bounty correctly', () => {
    const wrapper = createWrapper(mockMissionAvailable);
    expect(wrapper.find('.bounty').text()).toBe('$5.000');
  });

  // Test Case 4: Formats the deadline correctly
  it('formats the deadline correctly', () => {
    const wrapper = createWrapper(mockMissionAvailable);
    // Assuming '2025-08-15' formats to '15 Agt 2025' in 'id-ID' locale
    expect(wrapper.find('.deadline').text()).toBe('15 Agu 2025');
  });

  // Test Case 5: Displays correct status and class for 'assigned' mission
  it('displays correct status and class for "assigned" mission', () => {
    const wrapper = createWrapper(mockMissionAssigned);
    expect(wrapper.find('.mission-status').text()).toBe('Ditugaskan');
    expect(wrapper.find('.mission-status').classes()).toContain('status-assigned');
  });

  // Test Case 6: Displays correct status and class for 'completed' mission
  it('displays correct status and class for "completed" mission', () => {
    const wrapper = createWrapper(mockMissionCompleted);
    expect(wrapper.find('.mission-status').text()).toBe('Selesai');
    expect(wrapper.find('.mission-status').classes()).toContain('status-completed');
  });

  // Test Case 7: Renders action slot content
  it('renders content passed through the #actions slot', () => {
    const wrapper = mount(MissionCard, {
      props: {
        mission: mockMissionAvailable,
      },
      slots: {
        actions: '<button class="test-action-button">Custom Action</button>',
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: { RouterLink: RouterLinkStub },
      },
    });
    expect(wrapper.find('.test-action-button').exists()).toBe(true);
    expect(wrapper.find('.test-action-button').text()).toBe('Custom Action');
  });

  // Test Case 8: Detail link points to correct path for a client
  it('detail link points to client mission detail path when user is client', () => {
    const wrapper = createWrapper(mockMissionAvailable, {
      user: { id: 101, role: 'client' },
      isAuthenticated: true,
      userRole: 'client',
    });

    const routerLink = wrapper.findComponent(RouterLinkStub);
    expect(routerLink.props().to).toBe(`/client/missions/${mockMissionAvailable.id}`);
  });

  // Test Case 9: Detail link points to correct path for a ninja
  it('detail link points to ninja mission detail path when user is ninja', () => {
    const wrapper = createWrapper(mockMissionAvailable, {
      user: { id: 201, role: 'ninja' },
      isAuthenticated: true,
      userRole: 'ninja',
    });

    const routerLink = wrapper.findComponent(RouterLinkStub);
    expect(routerLink.props().to).toBe(`/ninja/missions/${mockMissionAvailable.id}`);
  });

  // Test Case 10: Detail link points to public path when user is not authenticated
  it('detail link points to public mission detail path when user is not authenticated', () => {
    const wrapper = createWrapper(mockMissionAvailable); // Default is not authenticated

    const routerLink = wrapper.findComponent(RouterLinkStub);
    expect(routerLink.props().to).toBe(`/missions/${mockMissionAvailable.id}`);
  });
});