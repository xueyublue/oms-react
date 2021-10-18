import React from "react";
import { Route, Switch } from "react-router-dom";
import * as Constants from "../util/constants";
import Dashboard from "./../pages/dashboard";
import InstanceDetails from "./../pages/instance/details";
import SgaConfigurations from "../pages/instance/sga";
import Banners from "./../pages/instance/banners";
import ResourceLimit from "./../pages/instance/resourcelimit";
import Parameters from "./../pages/instance/parameters";
import Sessions from "./../pages/performance/session";
import Tablespace from "./../pages/space/tablespace";
import TopTables from "./../pages/space/toptables";
import TopIndexes from "./../pages/space/topindexes";
import TableRecords from "./../pages/space/tablerecords";
import Profiles from "./../pages/user/profiles";
import Roles from "./../pages/user/roles";
import RolePrivileges from "./../pages/user/roleprivileges";
import Users from "./../pages/user/users";
import UserPrivileges from "./../pages/user/userprivileges";
import Login from "./../pages/login";
import Settings from "../pages/settings";
import Profile from "../pages/profile";

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
      <Route exact path={Constants.ROUTE_INSTANCE_SGA} component={SgaConfigurations} />
      <Route exact path={Constants.ROUTE_INSTANCE_BANNERS} component={Banners} />
      <Route exact path={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT} component={ResourceLimit} />
      <Route exact path={Constants.ROUTE_INSTANCE_PARAMETERS} component={Parameters} />
      <Route exact path={Constants.ROUTE_PERFORMANCE_SESSION} component={Sessions} />
      <Route exact path={Constants.ROUTE_SPACE_TABLESPACE} component={Tablespace} />
      <Route exact path={Constants.ROUTE_SPACE_TOP_TABLES} component={TopIndexes} />
      <Route exact path={Constants.ROUTE_SPACE_TOP_INDEXES} component={TopTables} />
      <Route exact path={Constants.ROUTE_SPACE_TABLE_RECORDS} component={TableRecords} />
      <Route exact path={Constants.ROUTE_USER_PROFILES} component={Profiles} />
      <Route exact path={Constants.ROUTE_USER_ROLES} component={Roles} />
      <Route exact path={Constants.ROUTE_USER_ROLE_PRIVILEGES} component={RolePrivileges} />
      <Route exact path={Constants.ROUTE_USER_USERS} component={Users} />
      <Route exact path={Constants.ROUTE_USER_PROFILES} component={UserPrivileges} />
      <Route exact path={Constants.ROUTE_PROFILE} component={Profile} />
      <Route exact path={Constants.ROUTE_SETTINGS} component={Settings} />
      <Route exact path={Constants.ROUTE_LOGIN} component={Login} />
    </Switch>
  );
};

export default PageContainer;
