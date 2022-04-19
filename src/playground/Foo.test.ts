/**
 * @file: Foo.spec.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

function sum(a: number, b: number): number {
  return a + b;
}

function compileAndroidCode() {
  throw new Error('you are using the wrong JDK');
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData(fail = false): Promise<string> {
  await sleep(1000);
  if (fail) throw new Error('fail');
  return 'success';
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrow(/JDK/);
});

test('the data is success with callback', done => {
  fetchData()
    .then(result => {
      try {
        expect(result).toBe('success');
        done();
      } catch (e) {
        done(e);
      }
    })
    .catch(err => {
      done(err);
    });
});

test('the data is success with promise', async () => {
  return fetchData().then(result => {
    expect(result).toBe('success');
  });
});

test('the data is success with jest directives', async () => {
  return expect(fetchData()).resolves.toBe('success');
});

test('the data is failed with jest directives', async () => {
  expect.assertions(1);
  return expect(fetchData(true)).rejects.toThrow(/fail/);
});
