import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./../pages/dashboard";
import InstanceDetails from "./../pages/instance/details";
//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const PageContainer = () => {
  return (
    <div>
      <main>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/home" component={Dashboard} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/instance/details" component={InstanceDetails} />
        </Switch>
      </main>
    </div>
  );
};

export default PageContainer;
