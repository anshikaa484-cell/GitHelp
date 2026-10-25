import "@testing-library/jest-dom";

// jsdom (the fake browser used in tests) lacks these, so stub them.
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} };
Element.prototype.scrollIntoView ??= function () {};
