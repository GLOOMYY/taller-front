import { describe, expect, it } from "vitest";
import { formatDecimalMoney } from "./money";

describe("formatDecimalMoney", () => {
  it("formatea el string sin convertirlo a Number", () => {
    expect(formatDecimalMoney("12345678901234567890.50", "COP")).toBe("$12.345.678.901.234.567.890,5 COP");
  });
  it("conserva signo y responde de forma segura ante entradas inválidas", () => {
    expect(formatDecimalMoney("-45.25", "USD")).toBe("−US$45,25 USD");
    expect(formatDecimalMoney("sin-valor", "COP")).toBe("sin-valor COP");
  });
});
