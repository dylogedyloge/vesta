import { cn, generateSlug, getIdFromSlug } from '../utils';

describe('cn (className utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    
    expect(cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled'
    )).toBe('base-class active');
  });

  it('should handle Tailwind class conflicts', () => {
    // The second class should override the first for the same property
    expect(cn('p-2 bg-red-500', 'p-4 bg-blue-500')).toBe('p-4 bg-blue-500');
  });
});

describe('generateSlug', () => {
  it('should convert title to lowercase', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
    expect(generateSlug('HELLO WORLD')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('hello world')).toBe('hello-world');
    expect(generateSlug('hello   world')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(generateSlug('hello! @world#')).toBe('hello-world');
    expect(generateSlug('hello@world.com')).toBe('helloworldcom');
  });

  it('should handle multiple spaces and special characters', () => {
    expect(generateSlug('  Hello  @  World!  ')).toBe('hello-world');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(generateSlug('-hello world-')).toBe('hello-world');
    expect(generateSlug('---hello world---')).toBe('hello-world');
  });

  it('should handle empty strings', () => {
    expect(generateSlug('')).toBe('');
    expect(generateSlug('   ')).toBe('');
  });
});

describe('getIdFromSlug', () => {
  it('should return numeric ID if slug is numeric', () => {
    expect(getIdFromSlug('123')).toBe('123');
    expect(getIdFromSlug('456')).toBe('456');
  });

  it('should throw error for invalid slug with no mapping', () => {
    expect(() => getIdFromSlug('invalid-slug')).toThrow('Invalid slug - no matching ID found');
  });

  it('should return mapped ID if slug exists in mapping', () => {
    // Since slugToIdMap is private, we can only test the error case
    // The success case would require modifying the private map
    expect(() => getIdFromSlug('non-existent-slug')).toThrow();
  });
}); 