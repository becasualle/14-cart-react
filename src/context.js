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
  const [state, dispatch] = useReducer(reducer, initialState);

  // when we click on button in CartContainer, set state.cart: [];
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  // when we click on button in CartItem, we filter state.cart by id of this item
  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  // when we click on button in CartItem, we update state.amount depending on type (+1 for increase, -1 for decrease)
  const change = (id, type) => {
    dispatch({ type: 'CHANGE', payload: { id, type } })
  }

  // when component mounts, update state.cart with fetched data. Before it show data from local data.js file
  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    const response = await fetch(url);
    const cart = await response.json();
    dispatch({ type: 'DISPLAY_ITEMS', payload: cart })
  }

  useEffect(() => { fetchData() }, []);

  // when state.cart changes, count amount and total and update state.amount and state.total
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
