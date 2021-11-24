import { Route, Switch } from "react-router-dom";
import Home from "../pages/home";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
    </Switch>
  );
};

export default Routes;
