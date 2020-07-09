import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const Login = React.lazy(() => import('./views/Login'));
const AdminHome = React.lazy(() => import('./views/AdminHome'));
const EmployeeHome = React.lazy(() => import('./views/EmployeeHome'));

function App() {
  const isAuth = sessionStorage.isAuth
  const PrivateRoute = ({ children, ...rest }) => (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          JSON.parse(sessionStorage.user).isAdmin ?
            <AdminHome /> : <EmployeeHome />
        ) :
          (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
  return (
    <HashRouter>
      <React.Suspense fallback={loading()}>
        <Switch>
          <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
          <PrivateRoute path="/" name="Home"  >
          </PrivateRoute>
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
