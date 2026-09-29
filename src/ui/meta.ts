/**
 * Documentation for one component, read by the Umber website.
 * You do not need this file, or any *.meta.ts file, when you copy a component.
 */
export type ComponentMeta = {
  /** The exported type that lists the props this component adds. The props table is built from it. */
  propsType: string;
  /** The native element the component renders, whose props it also accepts. */
  element: string;
  /** What the component does for accessibility, one point per line. */
  accessibility: string[];
};
