import { describe, expect, it } from "vitest";
import { errorFromResponse } from "./errors";

describe("errorFromResponse", () => {
  it("traduce el estado y conserva la correlación", () => {
    const response = new Response(null, { status: 403, headers: { "x-correlation-id": "corr-123" } });
    const error = errorFromResponse(response);
    expect(error.message).toMatch(/permiso/i);
    expect(error.status).toBe(403);
    expect(error.correlationId).toBe("corr-123");
  });
  it("prioriza el mensaje seguro enviado por la API", () => {
    const error = errorFromResponse(new Response(null, { status: 422 }), { detail: "Revisa los datos" });
    expect(error.message).toBe("Revisa los datos");
  });
});
