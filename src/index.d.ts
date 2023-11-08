/// <reference types="chai" />

declare module 'chai-webdriverio-async' {
  import { Browser } from 'webdriverio'
  export type ChaiWebdriverioAsyncOptions = {
    $: Browser['$']
    $$: Browser['$$']
    waitUntil: Browser['waitUntil']
  }

  export default function chaiWebdriverioAsync(
    options: ChaiWebdriverioAsyncOptions
  ): Chai.ChaiPlugin
}

declare namespace Chai {
  interface Assertion
    extends LanguageChains,
      NumericComparison,
      TypeComparison {
    attribute(name: string, value?: string | RegExp): Assertion
    clickable(): Assertion
    count(): Assertion
    count(expected: number): Assertion
    existing(): Assertion
    displayed(): Assertion
    displayedInViewport(): Assertion
    enabled(): Assertion
    focused(): Assertion
    selected(): Assertion
    text(): Assertion
    text(val: string | RegExp): Assertion
    value(): Assertion
    value(val: string | RegExp): Assertion
  }
}
