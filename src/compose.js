/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  // 如果传入的 functions 长度为 0，即没传，则返回的方法传入什么参数返回什么参数
  if (funcs.length === 0) {
    return arg => arg
  }
  // 如果传入的 functions 长度为 1，即只有一个函数，则返回改函数，例如如果 applymiddleware(thunk)，则调用的是 compose(thunk(middlewareAPI))(store.dispatch)，此时返回 thunk(middlewareAPI) 函数
  if (funcs.length === 1) {
    return funcs[0]
  }
  // 进行 reduce，实现 compose(f, g, h) 相当于 (...args) => f(g(h(...args)))
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
