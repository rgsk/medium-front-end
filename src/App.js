import React from 'react';
import openSocket from 'socket.io-client';
import GenericBlogs from './containers/GenericBlogs';
import CreateBlog from './containers/CreateBlog';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';
import Blog from './containers/Blog';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';
class App extends React.Component {
  componentDidMount() {
    this.props.onInitCategories();

    const socket = openSocket('http://localhost:8080');
    socket.on('categories', (data) => {
      if (data.action === 'create') {
        // console.log(data.category);
        this.props.onAddCategory(data.category);
      } else if (data.action === 'modified') {
        this.props.onModifyCategory(data.category);
      }
    });
  }
  render() {
    return (
      <div>
        <NavLink to="/blogs">Blogs</NavLink>
        <NavLink to="/create-blog">Create Blog</NavLink>

        <Switch>
          <Route path="/blogs/:title" component={Blog}></Route>
          <Route path="/blogs" component={GenericBlogs}></Route>
          <Route path="/create-blog" component={CreateBlog}></Route>
          <Redirect from="/" to="/blogs"></Redirect>
          <Route render={() => <h1>Not Found</h1>}></Route>
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    categories: state.blog.categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitCategories: () => dispatch(actions.initCategories()),
    onAddCategory: (category) => dispatch(actions.addCategory(category)),
    onModifyCategory: (category) => dispatch(actions.modifyCategory(category)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
