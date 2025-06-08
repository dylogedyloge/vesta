import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../useInfiniteScroll';

describe('useInfiniteScroll', () => {
  const mockCallback = jest.fn();
  let mockObserverInstance: { observe: jest.Mock; unobserve: jest.Mock; disconnect: jest.Mock };
  let observerCallback: (entries: { isIntersecting: boolean }[]) => void;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    mockCallback.mockClear();

    // Create a new mock observer instance for each test
    mockObserverInstance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    // Mock the IntersectionObserver constructor
    window.IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return mockObserverInstance;
    }) as unknown as typeof IntersectionObserver;
  });

  it('should create an IntersectionObserver with correct options', () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );
  });

  it('should observe the target element when ref is set', () => {
    const { result, rerender } = renderHook(() => useInfiniteScroll(mockCallback));

    // First render creates the observer
    expect(window.IntersectionObserver).toHaveBeenCalled();

    // Simulate setting the ref
    const mockElement = document.createElement('div');
    act(() => {
      Object.defineProperty(result.current.observerTarget, 'current', {
        value: mockElement,
        writable: true
      });
    });

    // Force a re-render to trigger the ref effect
    rerender();

    expect(mockObserverInstance.observe).toHaveBeenCalledWith(mockElement);
  });

  it('should call callback when intersection is detected', () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    // Simulate intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(mockCallback).toHaveBeenCalled();
  });

  it('should not call callback when intersection is not detected', () => {
    renderHook(() => useInfiniteScroll(mockCallback));

    // Simulate no intersection
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should update isIntersecting state correctly', () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));

    // Simulate intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    expect(result.current.isIntersecting).toBe(true);

    // Simulate no intersection
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });
    expect(result.current.isIntersecting).toBe(false);
  });

  it('should unobserve and disconnect on unmount', () => {
    const { result, rerender, unmount } = renderHook(() => useInfiniteScroll(mockCallback));

    // Simulate setting the ref
    const mockElement = document.createElement('div');
    act(() => {
      Object.defineProperty(result.current.observerTarget, 'current', {
        value: mockElement,
        writable: true
      });
    });

    // Force a re-render to trigger the ref effect
    rerender();

    // Unmount should trigger cleanup
    unmount();

    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
  });
}); 