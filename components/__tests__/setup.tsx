import '@testing-library/jest-dom';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
    toString: jest.fn()
  }))
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: () => React.createElement('div', null, 'Plus Icon')
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode } & Record<string, any>) => 
    React.createElement('button', props, children)
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => 
    React.createElement('table', null, children),
  TableHeader: ({ children }: { children: React.ReactNode }) => 
    React.createElement('thead', null, children),
  TableBody: ({ children }: { children: React.ReactNode }) => 
    React.createElement('tbody', null, children),
  TableHead: ({ children }: { children: React.ReactNode }) => 
    React.createElement('th', null, children),
  TableRow: ({ children }: { children: React.ReactNode }) => 
    React.createElement('tr', null, children),
  TableCell: ({ children }: { children: React.ReactNode }) => 
    React.createElement('td', null, children)
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: { children: React.ReactNode, onValueChange?: (value: string) => void }) => 
    React.createElement('select', { onChange: (e: any) => onValueChange?.(e.target.value) }, children),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', null, children),
  SelectValue: ({ children }: { children: React.ReactNode }) => 
    React.createElement('span', null, children),
  SelectContent: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', null, children),
  SelectItem: ({ children, value }: { children: React.ReactNode, value: string }) => 
    React.createElement('option', { value }, children)
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: Record<string, any>) => React.createElement('input', props)
}));

jest.mock('@/components/ui/multiple-selector', () => ({
  MultipleSelector: ({ options, selected, onChange }: { 
    options: Array<{ value: string, label: string }>, 
    selected?: string[], 
    onChange?: (values: string[]) => void 
  }) => 
    React.createElement('select', {
      multiple: true,
      value: selected,
      onChange: (e: any) => {
        const values = Array.from(e.target.selectedOptions, (option: any) => option.value);
        onChange?.(values);
      }
    }, options.map(opt => 
      React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
    )),
  Option: ({ value, label }: { value: string, label: string }) => ({ value, label })
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => 
    React.createElement('span', null, children)
}));

jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => 
    React.createElement('nav', null, children),
  PaginationContent: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', null, children),
  PaginationItem: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', null, children),
  PaginationLink: ({ children, ...props }: { children: React.ReactNode } & Record<string, any>) => 
    React.createElement('a', props, children),
  PaginationNext: ({ children }: { children?: React.ReactNode }) => 
    React.createElement('button', null, children || 'Next'),
  PaginationPrevious: ({ children }: { children?: React.ReactNode }) => 
    React.createElement('button', null, children || 'Previous'),
  PaginationEllipsis: () => React.createElement('span', null, '...')
}));

// Mock custom components
jest.mock('@/components/TableSkeleton', () => ({
  TableSkeleton: () => 
    React.createElement('div', { 'data-testid': 'table-skeleton' }, 'Loading...')
}));

jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => React.createElement('div', null, 'Theme Toggle')
}));

// Mock hooks
jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(() => false)
}));

jest.mock('@/hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: jest.fn(() => ({
    observerTarget: null,
    isLoading: false,
    hasMore: true
  }))
}));

// Mock store
jest.mock('@/store/todoStore', () => ({
  useTodoStore: jest.fn()
}));

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];
    
    private readonly observerCallback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.observerCallback = callback;
    }

    observe(target: Element): void {
      // Simulate an intersection
      this.observerCallback([{
        isIntersecting: true,
        target,
        intersectionRatio: 1,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now()
      }], this);
    }

    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  };
}); 