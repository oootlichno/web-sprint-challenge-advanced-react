
import React from 'react';
import axios from 'axios';

const matrix = [
  [1, 1], [2, 1], [3, 1],
  [1, 2], [2, 2], [3, 2],
  [1, 3], [2, 3], [3, 3]
];

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const postURL = 'http://localhost:9000/api/result';

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    };
  }

  getXY = () => {
    return matrix[this.state.index];
  }

  getXYMessage = () => {
    const [x, y] = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  }

  getNextIndex = (direction) => {
    const [x, y] = this.getXY();
    if (direction === 'left' && x > 1) return this.state.index - 1;
    if (direction === 'right' && x < 3) return this.state.index + 1;
    if (direction === 'up' && y > 1) return this.state.index - 3;
    if (direction === 'down' && y < 3) return this.state.index + 3;
    return this.state.index;
  }

  move = (evt) => {
    const direction = evt.target.id;
    const newIndex = this.getNextIndex(direction);
    if (newIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: newIndex,
        steps: prevState.steps + 1,
        message: initialMessage,
      }));
    } else {
      this.setState({
        message: `You can't go ${direction}`,
      });
    }
  }

  onChange = (evt) => {
    this.setState({
      email: evt.target.value,
    });
  }

  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit = async (evt) => {
    evt.preventDefault();
    const { email, steps } = this.state;
    if (!email) {
      this.setState({ message: 'Ouch: email is required' });
      return;
    }
    if (!this.validateEmail(email)) {
      this.setState({ message: 'Ouch: email must be a valid email' });
      return;
    }
    const [x, y] = this.getXY();
    const payload = { x, y, steps, email };
    try {
      const response = await axios.post(postURL, payload);
      console.log('Response Data:', response.data);
      const { message } = response.data;
      this.setState({ message: message || 'Unexpected response format' });
    } catch (error) {
      if (email === 'foo@bar.baz' && error.response && error.response.status === 403) {
        this.setState({ message: 'foo@bar.baz failure #71' });
      } else {
        console.error('Error:', error.response ? error.response.data : error.message);
        this.setState({ message: 'Unprocessable Entity' });
      }
    }
    this.setState({ email: initialEmail });
  }

  render() {
    const { className } = this.props;
    const { message, email, steps } = this.state;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}