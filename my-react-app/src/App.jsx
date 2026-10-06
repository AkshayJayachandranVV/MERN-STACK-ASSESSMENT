import { useState } from 'react'
import axios from 'axios'
import './App.css'

const initialValues = {
  customerName: '',
  product: '',
  quantity: '',
  price: '',
  orderStatus: 'Pending',
  orderDate: new Date().toLocaleDateString('en-CA'),
}

const fieldLabels = {
  customerName: 'Customer name',
  product: 'Product',
  quantity: 'Quantity',
  price: 'Price',
  orderStatus: 'Order status',
  orderDate: 'Order date',
}

function validate(values) {
  const errors = {}

  if (!values.customerName.trim()) {
    errors.customerName = 'Enter the customer name.'
  }
  if (!values.product.trim()) {
    errors.product = 'Enter a product name.'
  }
  if (!Number.isInteger(Number(values.quantity)) || Number(values.quantity) < 1) {
    errors.quantity = 'Enter a whole number greater than zero.'
  }
  if (!Number.isFinite(Number(values.price)) || Number(values.price) <= 0) {
    errors.price = 'Enter a price greater than zero.'
  }
  if (!['Pending', 'Processing', 'Shipped', 'Delivered'].includes(values.orderStatus)) {
    errors.orderStatus = 'Choose a valid order status.'
  }
  if (!values.orderDate || Number.isNaN(Date.parse(values.orderDate))) {
    errors.orderDate = 'Choose a valid order date.'
  }

  return errors
}

function App() {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const errors = validate(values)

  function handleChange(event) {
    const { name, value } = event.target
    setValues(current => ({ ...current, [name]: value }))
    setConfirmation('')
    setSubmitError('')
  }

  function handleBlur(event) {
    setTouched(current => ({ ...current, [event.target.name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setTouched(
      Object.keys(fieldLabels).reduce((allTouched, field) => {
        allTouched[field] = true
        return allTouched
      }, {}),
    )

    if (Object.keys(errors).length > 0) {
      setConfirmation('')
      setSubmitError('')
      return
    }

    const orderData = {
      customerName: values.customerName,
      product: values.product,  
    quantity: Number(values.quantity),
      price: Number(values.price),
      orderStatus: values.orderStatus,
      orderDate: new Date(values.orderDate),
    }

    setIsSubmitting(true)
    setSubmitError('')
    setConfirmation('')
    try {
      await axios.post('http://localhost:3000/api/orders', orderData)
      setConfirmation('Order created successfully.')
    } catch (error) {
      const message = error.response?.data?.error
      setSubmitError(message || 'Could not create the order. Check the server connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderFieldError(name) {
    const error = (touched[name] || submitted) && errors[name]
    return error ? (
      <span className="field-error" id={`${name}-error`} role="alert">
        {error}
      </span>
    ) : null
  }

  return (
    <main className="page">
      <section className="order-card" aria-labelledby="page-title">
        <header className="form-header">
          <span className="eyebrow">ORDER MANAGEMENT</span>
          <h1 id="page-title">Create an order</h1>
          <p>Enter the order details below. Fields marked with * are required.</p>
        </header>

        <form className="order-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="customerName">Customer name <span>*</span></label>
            <input
              autoComplete="name"
              className={renderFieldError('customerName') ? 'invalid' : ''}
              id="customerName"
              name="customerName"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="e.g. Ava Patel"
              aria-describedby={renderFieldError('customerName') ? 'customerName-error' : undefined}
              value={values.customerName}
            />
            {renderFieldError('customerName')}
          </div>

          <div className="field">
            <label htmlFor="product">Product <span>*</span></label>
            <input
              className={renderFieldError('product') ? 'invalid' : ''}
              id="product"
              name="product"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="e.g. Wireless mouse"
              aria-describedby={renderFieldError('product') ? 'product-error' : undefined}
              value={values.product}
            />
            {renderFieldError('product')}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="quantity">Quantity <span>*</span></label>
              <input
                className={renderFieldError('quantity') ? 'invalid' : ''}
                id="quantity"
                min="1"
                name="quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="1"
                step="1"
                type="number"
                aria-describedby={renderFieldError('quantity') ? 'quantity-error' : undefined}
                value={values.quantity}
              />
              {renderFieldError('quantity')}
            </div>

            <div className="field">
              <label htmlFor="price">Price <span>*</span></label>
              <div className="price-input">
                <span aria-hidden="true">$</span>
                <input
                  className={renderFieldError('price') ? 'invalid' : ''}
                  id="price"
                  min="0.01"
                  name="price"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  aria-describedby={renderFieldError('price') ? 'price-error' : undefined}
                  value={values.price}
                />
              </div>
              {renderFieldError('price')}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="orderStatus">Order status</label>
              <select
                id="orderStatus"
                name="orderStatus"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.orderStatus}
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
              {renderFieldError('orderStatus')}
            </div>

            <div className="field">
              <label htmlFor="orderDate">Order date <span>*</span></label>
              <input
                className={renderFieldError('orderDate') ? 'invalid' : ''}
                id="orderDate"
                name="orderDate"
                onBlur={handleBlur}
                onChange={handleChange}
                type="date"
                aria-describedby={renderFieldError('orderDate') ? 'orderDate-error' : undefined}
                value={values.orderDate}
              />
              {renderFieldError('orderDate')}
            </div>
          </div>

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating order…' : 'Create order'}
            <span aria-hidden="true">→</span>
          </button>

          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}

          {confirmation && (
            <p className="form-confirmation" role="status">
              {confirmation}
            </p>
          )}
        </form>
      </section>
      <p className="page-note">A clear view of every order, from start to delivery.</p>
    </main>
  )
}

export default App
