"use strict";

var config = require("../config"),
    roleAPIRouter = require("./apis/role_api-router"),
    userAPIRouter = require("./apis/user_api-router"),
    workAssignAPIRouter = require("./apis/work_assign_api-router"),
    workAssignInfoAPIRouter = require("./apis/work_assign_info_api-router"),
    taskAPIRouter = require("./apis/task_api-router"),
    taskCategoryAPIRouter = require("./apis/task_category_api-router"),
    cookAPIRouter = require("./apis/cook_api-router"),
    cleanAPIRouter = require("./apis/clean_api-router"),
    workReportAPIRouter = require("./apis/work_report_api-router");

function register(app) {
    app.use(["/moranbong_api/" + config.get("api:version") + "/roles", "/roles"], roleAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/users", "/users"], userAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/work_assigns", "/work_assigns"], workAssignAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/work_assign_infos", "/work_assign_infos"], workAssignInfoAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/tasks", "/tasks"], taskAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/task_categories", "/task_categories"], taskCategoryAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/cooks", "/cooks"], cookAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/cleans", "/cleans"], cleanAPIRouter);
    app.use(["/moranbong_api/" + config.get("api:version") + "/work_reports", "/work_reports"], workReportAPIRouter);
}

exports.register = register;
