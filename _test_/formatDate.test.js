import { formatDate } from "../src/client/js/formatDates";

describe("format a date to work with api", () => {
  test("Formating a date", () => {
    const date = new Date();
    expect(formatDate(date)).toBeDefined();
  });
});
