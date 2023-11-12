import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import cartItem from '../../cartItems'
import axios from 'axios'

const url = 'https://course-api.com/react-useReducer-cart-project'

export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (name, thunkApi) => {
    try {
      const resp = await axios(url)
      return resp.data
    } catch (error) {
      return thunkApi.rejectWithValue('Something went wrong')
    }
  }
)

const initialState = {
  cartItems: cartItem,
  amount: 4,
  total: 0,
  isLoading: true,
}

const cartSlice = createSlice({
  name: 'cat',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []
    },
    removeItem: (state, action) => {
      const newId = action.payload
      state.cartItems = state.cartItems.filter((item) => item.id !== newId)
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id)
      cartItem.amount = cartItem.amount + 1
    },

    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id)
      cartItem.amount = cartItem.amount - 1
    },

    calculateTotals: (state) => {
      let amount = 0
      let total = 0
      state.cartItems.forEach((item) => {
        amount += item.amount
        total += item.amount * item.price
      })
      state.amount = amount
      state.total = total
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCartItems.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCartItems.fulfilled, (state, action) => {
      console.log(action)
      state.isLoading = false
      state.cartItems = action.payload
    })
    builder.addCase(getCartItems.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions

export default cartSlice.reducer
