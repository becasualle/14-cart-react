// import CartItem from './CartItem';
// import { useGlobalContext } from './context'

const reducer = (state, action) => {

    if (action.type === 'CLEAR_CART') {
        // copy all state props, but change cart to empty array
        return { ...state, cart: [] }
    }

    if (action.type === 'REMOVE_ITEM') {
        // update state cart prop with new filtered array of items
        return { ...state, cart: state.cart.filter(item => item.id !== action.payload) }
    }

    if (action.type === 'CHANGE') {
        const { id, type } = action.payload;

        let tempCart = state.cart.map(item => {
            if (item.id === id && type === 'increase') {
                return { ...item, amount: item.amount + 1 }
            }
            if (item.id === id && type === 'decrease') {
                return { ...item, amount: item.amount - 1 }
            }
            return item
        }).filter(item => item.amount !== 0);

        return { ...state, cart: tempCart }

    }

    // call it with use effect - every time state.cart changes
    if (action.type === 'GET_TOTALS') {
        // get value of total and amount prop from reduce return object by destructuring
        let { total, amount } = state.cart
            .reduce((cartTotal, cartItem) => {
                // get price and amount values of item and store it
                const { price, amount } = cartItem;
                // increase amount in cartTotal
                cartTotal.amount += amount;
                cartTotal.total += price * amount;
                return cartTotal
            },
                // set initial value of cartTotal
                {
                    total: 0,
                    amount: 0
                }
            )
        // returns a floating point number with 2 digits after the decimal place
        total = parseFloat(total.toFixed(2))
        // update state with new values of total and amount
        return { ...state, total, amount }
    }

    if (action.type === 'LOADING') {
        return { ...state, loading: true }
    }

    if (action.type === 'DISPLAY_ITEMS') {
        return { ...state, cart: action.payload, loading: false }
    }


    throw new Error('no matching action type')
};

export default reducer;