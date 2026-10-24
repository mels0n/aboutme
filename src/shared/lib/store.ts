import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
    /** Whether the "how this site works" modal is open. Opened on request only; not persisted. */
    introOpen: boolean;
    /** The active persona mode. */
    mode: PersonaMode;
    /** The active view mode ('OFFICE' or 'LAB'). */
    viewMode: 'OFFICE' | 'LAB';

    /** Opens or closes the "how this site works" modal. */
    setIntroOpen: (value: boolean) => void;
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
export const usePersonaStore = create<PersonaStore>()(
    persist(
        (set) => ({
            mode: 'executive',
            viewMode: 'OFFICE',
            introOpen: false,
            setIntroOpen: (value) => set({ introOpen: value }),
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
        }),
        {
            name: 'persona-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                mode: state.mode
            }),
        }
    )
);
