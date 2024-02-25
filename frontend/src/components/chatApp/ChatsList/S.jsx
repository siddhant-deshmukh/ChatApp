class App extends React.Component {
  constructor() {
    super();
    
    let names = [
        'Cody Anderson', 
        'Jason Stubbs', 
        'Camron Levanger', 
        'Andrew Young', 
        'Tovin Hudson'
      ];
    
    names = names.map((name, index) => {
      return {
        name: name,
        key: name,
        ref: `name${index}`
      };
    });
    
    this.state = { names };
  }
  
  moveToTop(fromIndex) {
    const toIndex = 0;
    let newArray = this.state.names.slice(0);
        
    newArray.splice(toIndex, 0, newArray.splice(fromIndex, 1)[0]);
    
    this.setState({ names: newArray });
  }
  
  render() {
    return (
      <List 
        names={this.state.names} 
        onNameClick={this.moveToTop.bind(this)} />
    );
  }
}



class List extends React.Component {
  componentWillReceiveProps() {
    this.props.names.forEach( (name) => {
      // find the ref for this specific name
      const ref = this.refs[name.ref];
      
      // Look up the DOM node
      const domNode = ReactDOM.findDOMNode(ref);
      
      // Calculate the bounding box
      const boundingBox = domNode.getBoundingClientRect();
      
      // Store that box in the state, by its key.
      this.setState({ [name.key]: boundingBox });
    })
  }
  
  componentDidUpdate(previousProps) {
    // The DOM's new layout has been calculated
    // The screen has not been updated
    previousProps.names.forEach((name) => {
      let domNode = ReactDOM.findDOMNode(this.refs[name.ref]);
      const newBox = domNode.getBoundingClientRect();
      const oldBox = this.state[name.key];
      
      const deltaY = oldBox.top - newBox.top;
      
      
      if (deltaY) {
        requestAnimationFrame(() => {
          // Before the DOM paints, Invert it to its old position
          domNode.style.transform = `translate3d(0, ${deltaY}px, 0)`;

          // Ensure that it inverts it immediately
          domNode.style.transition = 'transform 0s';

          requestAnimationFrame( () => {
            
            if (deltaY < 0) {
              // moving down in rank
              // In order to get the animation to play, we'll need to wait for
              // the 'invert' animation frame to finish, so that its inverted
              // position has propagated to the DOM.
              //
              // Then, we just remove the transform, reverting it to its natural
              // state, and apply a transition so it does so smoothly.
              setTimeout(() => {
                domNode.style.transform  = '';
                domNode.style.transition = 'transform 500ms';
              }, 1500);
            } else {
              // moving up in rank
              domNode.style.backgroundColor = 'blue';
              domNode.style.transform = `perspective(1000px) translate3d(0, ${deltaY}px, 10px)`;
              domNode.style.transition = 'all 1500ms';
              
              setTimeout(() => {
                // moving up in rank
                domNode.style.transform = 'perspective(1000px) translate3d(0, 0, 10px)';
                domNode.style.transition = 'transform 500ms';
              }, 1500)

              setTimeout(() => {
                domNode.style.transform = `translate3d(0, 0, 0)`;
                domNode.style.backgroundColor = '#3F3F3F';
                domNode.style.transition = 'all 1500ms';
              }, 2500)
            }
          });
        });
      }
    });
  }
  
  onNameClick(index) {
    this.props.onNameClick(index);
  }
  
  renderList(names) {
    return names.map((name, index) => {
      return (
        <li 
          key={name.key} 
          ref={name.ref}
          onClick={() => {this.onNameClick(index)}}>
          {name.name}
        </li>
      );
    });
  }
  
  render() {
    return (
      <ul>
        {this.renderList(this.props.names)}
      </ul>
    );
  }
}
 
ReactDOM.render(<App />, document.getElementById('react'));