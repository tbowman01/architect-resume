import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { whileInView, whileHover, whileTap, initial, animate, transition, viewport, ...cleanProps } = props;
      return <div {...cleanProps}>{children}</div>;
    },
    button: ({ children, ...props }) => {
      const { whileInView, whileHover, whileTap, initial, animate, transition, viewport, ...cleanProps } = props;
      return <button {...cleanProps}>{children}</button>;
    },
    a: ({ children, ...props }) => {
      const { whileInView, whileHover, whileTap, initial, animate, transition, viewport, ...cleanProps } = props;
      return <a {...cleanProps}>{children}</a>;
    },
    section: ({ children, ...props }) => {
      const { whileInView, whileHover, whileTap, initial, animate, transition, viewport, ...cleanProps } = props;
      return <section {...cleanProps}>{children}</section>;
    },
    footer: ({ children, ...props }) => {
      const { whileInView, whileHover, whileTap, initial, animate, transition, viewport, ...cleanProps } = props;
      return <footer {...cleanProps}>{children}</footer>;
    },
  },
}))

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})