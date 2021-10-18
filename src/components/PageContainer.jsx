import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./../pages/dashboard";
import InstanceDetails from "./../pages/instance/details";
import * as Constants from "../util/constants";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const PageContainer = () => {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/home" component={Dashboard} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path={Constants.ROUTE_INSTANCE_DETAILS} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_INSTANCE_SGA} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_INSTANCE_BANNERS} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_INSTANCE_PARAMETERS} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_PERFORMANCE_SESSION} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_SPACE_TABLESPACE} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_SPACE_TOP_TABLES} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_SPACE_TOP_INDEXES} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_SPACE_TABLE_RECORDS} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_USER_PROFILES} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_USER_ROLES} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_USER_ROLE_PRIVILEGES} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_USER_USERS} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_USER_PROFILES} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_PROFILE} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_SETTINGS} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_LOGIN} component={InstanceDetails} />
    </Switch>
  );
};

export default PageContainer;
