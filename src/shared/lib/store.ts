import { create } from 'zustand';

/**
 * Represents the active persona/view mode of the application.
 */
type PersonaMode = 'executive' | 'strategist' | 'engineer';

/**
 * Ordered list of available persona modes used for cycling logic.
 */
const MODES: PersonaMode[] = ['executive', 'strategist', 'engineer'];

/**
 * Global state interface for managing the current user persona.
 */
interface PersonaStore {
    /** The currently active persona mode. */
    mode: PersonaMode;
    /** The active view mode: 'OFFICE' (Professional) or 'LAB' (Creative). */
    viewMode: 'OFFICE' | 'LAB';
    /** Immutably updates the current persona mode. */
    setMode: (mode: PersonaMode) => void;
    /** Sets the view mode. */
    setViewMode: (viewMode: 'OFFICE' | 'LAB') => void;
    /**
     * Cycles through the available persona modes in a circular buffer.
     * @param direction - The direction to cycle ('next' for forward, 'prev' for backward).
     */
    cycleMode: (direction: 'next' | 'prev') => void;
}

/**
 * Zustand store hook for managing global application persona state.
 * Provides methods to directly set or cycle through personas.
 */
export const usePersonaStore = create<PersonaStore>((set) => ({
    mode: 'executive',
    viewMode: 'OFFICE',
    setMode: (mode) => set({ mode }),
    setViewMode: (viewMode) => set({ viewMode }),
    cycleMode: (direction) => set((state) => {
        const currentIndex = MODES.indexOf(state.mode);
        let newIndex: number;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % MODES.length;
        } else {
            // Add MODES.length to handle negative modulo result correctly
            newIndex = (currentIndex - 1 + MODES.length) % MODES.length;
        }
        return { mode: MODES[newIndex] };
    }),
}));
