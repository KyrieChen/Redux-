import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

// middlewares 是一个数组，用来放置要应用的中间件列表，例如 middlewares = [ thunk, createLogger() ]
export default function applyMiddleware(...middlewares) {
  // 调用 applyMiddleware 返回一个函数，这个函数传入的是 redux 的 createStore 方法，详情见 ./createStore.js
  return createStore => (...args) => {
    // 这里的 args 是指你在调用 createStore 时传入的参数，详情见 ./createStore.js 的 createStore 方法当有 enhancer 方法时的情况
    const store = createStore(...args)
    // 在还没执行完中间件时候调用 dispatch 抛出错误
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }
    let chain = []
    // 生成 middlewareAPI 对象，其中 getState 是 store 本身自带的；dispatch 由于还没执行完中间件
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }

    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
