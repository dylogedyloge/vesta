import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../useIsMobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;

  // Helper function to simulate window resize
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  // Restore the original window width after each test
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('should return true for mobile viewport width', () => {
    setWindowWidth(767); // Below mobile breakpoint
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false for desktop viewport width', () => {
    setWindowWidth(768); // At mobile breakpoint
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    setWindowWidth(1024); // Above mobile breakpoint
    const { result: result2 } = renderHook(() => useIsMobile());
    expect(result2.current).toBe(false);
  });

  it('should update when window is resized', () => {
    const { result } = renderHook(() => useIsMobile());
    
    // Start with desktop width
    act(() => {
      setWindowWidth(1024);
    });
    expect(result.current).toBe(false);

    // Change to mobile width
    act(() => {
      setWindowWidth(500);
    });
    expect(result.current).toBe(true);

    // Change back to desktop width
    act(() => {
      setWindowWidth(1024);
    });
    expect(result.current).toBe(false);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useIsMobile());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
}); 