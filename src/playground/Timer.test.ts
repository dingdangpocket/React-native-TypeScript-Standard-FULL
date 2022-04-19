/**
 * @file: Timer.test.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

function timerGame(callback?: () => void) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback?.();
  }, 1000);
}

function infiniteTimerGame(callback?: () => void) {
  console.log('Ready....go!');

  setTimeout(() => {
    console.log("Time's up! 10 seconds before the next game starts...");
    callback?.();

    // Schedule the next game in 10 seconds
    setTimeout(() => {
      infiniteTimerGame(callback);
    }, 10000);
  }, 1000);
}

describe('jest mock timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('fake timer: wait 1 second before end the game', () => {
    const callback = jest.fn();
    timerGame(callback);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('fast forward: wait 1 second before end the game', () => {
    const callback = jest.fn();
    timerGame(callback);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('schedule a 10-second timer after 1 second', () => {
    const callback = jest.fn();
    infiniteTimerGame(callback);

    // at this point in time, there should have been a single call to
    // setTimeout to schedule the end of game in 1 second
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    // fast forward and exhaust only currently pending timers
    // but not any new timers that get created during that process
    jest.runOnlyPendingTimers();

    expect(callback).toHaveBeenCalled();

    // and it should have created a new timer to start the game over
    // in 10 seconds
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  });
});
