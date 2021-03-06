const todo = (state, action) => {
  switch(action.type){
    case 'ADD_TODO':
      return {id:action.id, text:action.text, completed:false}
    case 'TOGGLE_TODO':
      if(state.id !== action.id){
        return state
      }
      return{
        ...state,
        completed : !state.completed

      };
    default:
      return state
  }
}



const todos = (state=[], action) => {
  switch(action.type){
    case 'ADD_TODO':
      return [...state, todo(undefined, action)]
    case 'TOGGLE_TODO':
      return state.map(t =>todo(t, action));
    default:
      return state
  }
}


const visibilityFilter = (state="SHOW_ALL", action) => {
  switch(action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const {combineReducers}  = Redux;

const todoApp = combineReducers({todos, visibilityFilter})

const {createStore} = Redux;

const store = createStore(todoApp);


let nextTodo = 0

const {Component}  = React



const getVisibleTodos = (todos, filter) => {
  switch(filter){
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t=>t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t=>!t.completed);
  }
}



const FilterLink = ({filter, currentFilter, children}) => {
  if(filter === currentFilter){
    return <span>{children}</span>
  }
  return (
    <a href="#" onClick={(e)=>{
      e.preventDefault();
      store.dispatch({type:'SET_VISIBILITY_FILTER', filter});
    }}>
      {children}
    </a>)
}

const Todo = ({onClick, text, completed}) => {
  return <li  onClick={onClick} style={{textDecoration:completed?'line-through':'none'}}>
    {text}
  </li>
}

const TodoList = ({todos, onTodoClick}) => {
  return <ul>
    {todos.map(t =>
      <Todo
        key={t.id} {...t}
        onClick={ () => {onTodoClick(t.id)}}
      />
    )}
  </ul>

}

class TodoApp extends Component {

  render() {
    const {todos, visibilityFilter} = this.props
    const visibleTodos = getVisibleTodos(todos, visibilityFilter)
    return (
      <div>
        <input ref={node => {this.input = node}}/>
        <button
          onClick={() => {
                store.dispatch({
                  type:'ADD_TODO',
                  text:this.input.value,
                  id:nextTodo++
                });
                this.input.value = '';
            }}> Add To do
        </button>

          <TodoList todos={visibleTodos}
              onTodoClick={(id) => (
              store.dispatch({
                type:'TOGGLE_TODO',
                id:id
              })
            )} />

        <p>
          Show: {' '}
          <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>All</FilterLink>{' '}
          <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>Completed</FilterLink>{' '}
          <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>Active</FilterLink>{' '}
        </p>
      </div>
    );
  }
}
const render = () => {
  ReactDOM.render( <TodoApp {...store.getState()}/>, document.getElementById('root'));
}
store.subscribe(render);
render();

