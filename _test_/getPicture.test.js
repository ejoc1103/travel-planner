import { getPicture } from "../src/client/js/getPicture";

describe("Gets a picture from pixabay api", () => {
  test("Get a picture", () => {
    const city_name = "paris";
    const country_code = "fr";
    expect(getPicture(city_name, country_code)).toBeDefined();
  });
});
