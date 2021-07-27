import React, { useContext, useReducer, useEffect } from 'react'
import cartItems from './data'
// store reducer in separate file
import reducer from './reducer'

const url = 'https://course-api.com/react-useReducer-cart-project'
const AppContext = React.createContext()

const initialState = {
  // will use in app js
  loading: false,
  // will use in CartContainer.js 
  cart: cartItems,
  total: 0,
  // will use in navbar
  amount: 0,
};


const AppProvider = ({ children }) => {
  // set card from data {id, title, price, img amount}
  const [state, dispatch] = useReducer(reducer, initialState);

  // will call this func in CartContainer, and provide action instructions in reducer.js
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  // call it in CartItem.js and will get id of item when click "remove btn"
  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const change = (id, type) => {
    dispatch({ type: 'CHANGE', payload: { id, type } })
  }
  // const increase = id => {
  //   dispatch({ type: 'INCREASE', payload: id })
  // }
  // const decrease = id => {
  //   dispatch({ type: 'DECREASE', payload: id })
  // }

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    const response = await fetch(url);
    const cart = await response.json();
    dispatch({ type: 'DISPLAY_ITEMS', payload: cart })
  }

  useEffect(() => { fetchData() }, []);

  useEffect(() => {
    dispatch({ type: 'GET_TOTALS' })
  }, [state.cart])

  return (
    <AppContext.Provider
      // spread out our state value
      value={{
        ...state,
        clearCart,
        removeItem,
        change
      }}
    >
      {children}
    </AppContext.Provider>
  )
}


// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
