import { useMutation, useQuery, gql } from "@apollo/client";
import { useState } from "react";
import "./BookingForm.css"

const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      name
      email
      from
      to
      adults
      children
      travelClass
      departureOn
      journeyType
    }
  }
`;

const ADD_BOOKING = gql`
  mutation AddBooking(
    $name: String!
    $email: String!
    $from: String!
    $to: String!
    $adults: Int!
    $children: Int!
    $travelClass: String!
    $departureOn: String!
    $journeyType: String!
  ) {
    addBooking(
      name: $name
      email: $email
      from: $from
      to: $to
      adults: $adults
      children: $children
      travelClass: $travelClass
      departureOn: $departureOn
      journeyType: $journeyType
    ) {
      id
      name
    }
  }
`;

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    from: "",
    to: "",
    adults: "",
    children: "",
    travelClass: "",
    departureOn: "",
    journeyType: "",
  });

  const { loading: bookingsLoading, error: bookingsError, data, refetch } = useQuery(GET_BOOKINGS);
  const [addBooking, { loading, error }] = useMutation(ADD_BOOKING, {
    onCompleted: () => {
      refetch(); // Refresh bookings after submission
      setFormData({
        name: "",
        email: "",
        from: "",
        to: "",
        adults: "",
        children: "",
        travelClass: "",
        departureOn: "",
        journeyType: "",
      });
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBooking({ variables: { ...formData, adults: Number(formData.adults), children: Number(formData.children) } });
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Travel Booking</h2>
      {loading && <p className="booking-loading">Submitting...</p>}
      {error && <p className="booking-error">Error: {error.message}</p>}
      
      <form className="booking-form" onSubmit={handleSubmit}>
        <input className="input-field" type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input className="input-field" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="input-field" type="text" name="from" placeholder="From" value={formData.from} onChange={handleChange} required />
        <input className="input-field" type="text" name="to" placeholder="To" value={formData.to} onChange={handleChange} required />
        
        <input className="input-field" type="number" name="adults" placeholder="Adults" min="1" value={formData.adults} onChange={handleChange} required />
        <input className="input-field" type="number" name="children" placeholder="Children" min="0" value={formData.children} onChange={handleChange} required />
        
        <select className="select-field" name="travelClass" placeholder="Travel Class" value={formData.travelClass} onChange={handleChange}>
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
        </select>
        
        <input className="input-field" type="date" name="departureOn" value={formData.departureOn} onChange={handleChange} required />
        
        <select className="select-field" name="journeyType" value={formData.journeyType} onChange={handleChange}>
          <option value="One Way">One Way</option>
          <option value="Round Trip">Round Trip</option>
        </select>
        
        <button className="submit-button" type="submit">Submit</button>
      </form>

      <h3 className="bookings-title">All Bookings</h3>
      {bookingsLoading && <p className="bookings-loading">Loading bookings...</p>}
      {bookingsError && <p className="bookings-error">Error fetching bookings: {bookingsError.message}</p>}
      
      {data && (
        <ul className="bookings-list">
          {data.bookings.map((booking) => (
            <li className="booking-item" key={booking.id}>
              <strong className="booking-name">{booking.name}</strong> - {booking.from} to {booking.to} ({booking.journeyType})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
