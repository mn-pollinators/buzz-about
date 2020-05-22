import { ExampleRound } from "./example.round";

xdescribe('Example .Round', () => {
  it('should create an instance', () => {
    expect(new ExampleRound("test", [])).toBeTruthy();
  });
});
